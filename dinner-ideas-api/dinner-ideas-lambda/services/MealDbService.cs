using System.Reflection;
using System.Runtime.CompilerServices;
using System.Text.RegularExpressions;
using dinner_ideas_lambda.models;
using Newtonsoft.Json;

[assembly: InternalsVisibleTo("dinner-ideas-lambda.Tests")]

namespace dinner_ideas_lambda.services;

public interface IMealDbService
{
    Task<DinnerItem?> GetRandomMeal();
    Task<List<DinnerItem>> SearchMeals(string query);
    Task<DinnerItem?> GetMealById(string mealId);
    Task<List<MealDbCategory>> GetCategories();
    Task<DinnerItem> ImportMeal(string mealId, int userId);
}

public class MealDbService : IMealDbService
{
    private readonly HttpClient _httpClient;
    private readonly IDinnerItemService _dinnerItemService;
    private const string BaseUrl = "https://www.themealdb.com/api/json/v1";
    private const string ApiKey = "1"; // Free test key

    public MealDbService(HttpClient httpClient, IDinnerItemService dinnerItemService)
    {
        _httpClient = httpClient;
        _dinnerItemService = dinnerItemService;
    }

    public async Task<DinnerItem?> GetRandomMeal()
    {
        var response = await _httpClient.GetStringAsync($"{BaseUrl}/{ApiKey}/random.php");
        var data = JsonConvert.DeserializeObject<MealDbResponse>(response);
        var meal = data?.Meals?.FirstOrDefault();
        return meal is null ? null : MapToDinnerItem(meal);
    }

    public async Task<List<DinnerItem>> SearchMeals(string query)
    {
        var response = await _httpClient.GetStringAsync($"{BaseUrl}/{ApiKey}/search.php?s={Uri.EscapeDataString(query)}");
        var data = JsonConvert.DeserializeObject<MealDbResponse>(response);
        return data?.Meals?.Select(MapToDinnerItem).ToList() ?? [];
    }

    public async Task<DinnerItem?> GetMealById(string mealId)
    {
        var response = await _httpClient.GetStringAsync($"{BaseUrl}/{ApiKey}/lookup.php?i={Uri.EscapeDataString(mealId)}");
        var data = JsonConvert.DeserializeObject<MealDbResponse>(response);
        var meal = data?.Meals?.FirstOrDefault();
        return meal is null ? null : MapToDinnerItem(meal);
    }

    public async Task<List<MealDbCategory>> GetCategories()
    {
        var response = await _httpClient.GetStringAsync($"{BaseUrl}/{ApiKey}/categories.php");
        var data = JsonConvert.DeserializeObject<MealDbCategoryResponse>(response);
        return data?.Categories ?? [];
    }

    public async Task<DinnerItem> ImportMeal(string mealId, int userId)
    {
        var meal = await GetMealById(mealId)
            ?? throw new InvalidOperationException($"Meal {mealId} not found");

        meal.CreatedBy = userId;
        meal.LastModifiedBy = userId;
        meal.CreatedDate = DateTime.UtcNow;
        meal.LastModifiedDate = DateTime.UtcNow;
        meal.Id = Guid.NewGuid(); // Fresh ID for the user's collection

        return await _dinnerItemService.CreateItem(meal);
    }

    /// <summary>
    /// Maps a TheMealDB meal to our DinnerItem model.
    /// Uses reflection to extract ingredient/measure pairs from the 20 flat fields.
    /// Best-effort associates ingredients with steps via text matching.
    /// </summary>
    internal static DinnerItem MapToDinnerItem(MealDbMeal m)
    {
        // Extract ingredients via reflection — TheMealDB uses strIngredient1..20 + strMeasure1..20
        var ingredients = ExtractIngredients(m);

        // Parse instructions into numbered steps
        var steps = ParseInstructionsToSteps(m.StrInstructions ?? "");

        // Best-effort: associate ingredients with steps by matching names in step text
        AssociateIngredientsWithSteps(ingredients, steps);

        // Map category + tags to FoodTag enum
        var tags = MapTags(m.StrCategory, m.StrTags);

        // Build a readable description
        var area = string.IsNullOrWhiteSpace(m.StrArea) ? null : m.StrArea;
        var category = string.IsNullOrWhiteSpace(m.StrCategory) ? null : m.StrCategory;
        var description = area != null && category != null
            ? $"A {category.ToLower()} dish from {area}. Imported from TheMealDB."
            : area != null
                ? $"A dish from {area}. Imported from TheMealDB."
                : "Imported from TheMealDB.";

        // Deterministic GUID from the TheMealDB meal ID
        var padded = (m.IdMeal ?? "0").PadLeft(12, '0');
        var guid = Guid.Parse("00000000-0000-0000-0000-" + padded[^12..]);

        return new DinnerItem
        {
            Id = guid,
            Name = m.StrMeal ?? "Unknown Meal",
            Description = description,
            PrepTime = 15,
            CookTime = 30,
            Steps = steps.ToArray(),
            Tags = tags.ToArray(),
            Ingredients = ingredients.ToArray(),
            ImageKey = m.StrMealThumb, // TheMealDB thumbnail URL (frontend detects full URLs)
            CreatedBy = 0,
            LastModifiedBy = 0,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow,
            Version = 1
        };
    }

    /// <summary>
    /// Uses reflection to extract non-empty ingredient/measure pairs from the
    /// 20 flat strIngredientN / strMeasureN properties on a MealDbMeal.
    /// Also cleans ingredient names by stripping redundant quantity/measurement prefixes.
    /// </summary>
    internal static List<Ingredient> ExtractIngredients(MealDbMeal meal)
    {
        var mealType = typeof(MealDbMeal);
        var ingredients = new List<Ingredient>();

        for (int i = 1; i <= 20; i++)
        {
            var ingProp = mealType.GetProperty($"StrIngredient{i}");
            var measProp = mealType.GetProperty($"StrMeasure{i}");

            var name = ingProp?.GetValue(meal) as string;
            var measure = measProp?.GetValue(meal) as string;

            if (string.IsNullOrWhiteSpace(name))
                continue;

            var cleanedName = CleanIngredientName(name.Trim());
            var amount = ParseAmount(measure);
            var measurement = InferMeasurement(measure);
            var isToTaste = measurement == Measurement.ToTaste || amount == 0;

            ingredients.Add(new Ingredient
            {
                Id = Guid.NewGuid(),
                Name = cleanedName,
                Description = string.IsNullOrWhiteSpace(measure) ? "" : measure.Trim(),
                Amount = amount,
                Measurement = measurement,
                Quantity = isToTaste ? (measure?.Trim() ?? "to taste") : null
            });
        }

        return ingredients;
    }

    /// <summary>
    /// Strips leading quantity/unit words from ingredient names
    /// (e.g., "2 cloves of garlic" → "garlic", "1 cup flour" → "flour").
    /// </summary>
    private static string CleanIngredientName(string name)
    {
        if (string.IsNullOrWhiteSpace(name)) return name;

        // Patterns like "2 cloves of ...", "1 cup ...", "500g ..."
        // Match: optional number/fraction + optional unit words + optional "of"
        var cleaned = Regex.Replace(name.Trim(),
            @"^[\d¼½¾⅓⅔⅛⅜⅝⅞./\s-]+" +               // leading numbers/fractions
            @"\s*" +
            @"(?:cloves?|slices?|bunches?|sprigs?|cans?|tins?|pinch(?:es)?|dash(?:es)?\s+of\s+)?" + // optional unit+of
            @"(?:cups?\s+(?:of\s+)?)?" +
            @"(?:tbsp|tablespoons?|tsp|teaspoons?|ml|millilitres?|litres?|liters?|g|grams?|kg|kilos?|oz|ounces?|lb|lbs|pounds?)\s+(?:of\s+)?",
            "", RegexOptions.IgnoreCase);

        // Also strip trailing "of" if it got left alone
        cleaned = Regex.Replace(cleaned.Trim(), @"^of\s+", "", RegexOptions.IgnoreCase);

        return string.IsNullOrWhiteSpace(cleaned) ? name : cleaned;
    }

    /// <summary>
    /// Best-effort association of ingredients to steps by matching ingredient names
    /// against step description text (case-insensitive substring match).
    /// Populates both <see cref="Ingredient.StepId"/> and <see cref="DinnerItemStep.IngredientIds"/>.
    /// </summary>
    internal static void AssociateIngredientsWithSteps(List<Ingredient> ingredients, List<DinnerItemStep> steps)
    {
        if (ingredients.Count == 0 || steps.Count == 0) return;

        foreach (var ingredient in ingredients)
        {
            // Skip ingredients that are already associated or have very short names
            if (ingredient.StepId.HasValue || ingredient.Name.Length < 3)
                continue;

            var ingredientName = ingredient.Name.ToLowerInvariant();

            // Try to find the ingredient name in any step description
            foreach (var step in steps)
            {
                var stepText = step.StepDescription.ToLowerInvariant();

                // Match whole word where possible, but fall back to substring
                if (stepText.Contains(ingredientName))
                {
                    ingredient.StepId = step.Id;
                    if (!step.IngredientIds.Contains(ingredient.Id))
                        step.IngredientIds.Add(ingredient.Id);
                    break; // Assign to first matching step
                }
            }
        }
    }

    /// <summary>
    /// Splits TheMealDB instructions (one big text block) into numbered steps.
    /// Tries newlines first, then sentence boundaries, then falls back to a single step.
    /// </summary>
    private static List<DinnerItemStep> ParseInstructionsToSteps(string instructions)
    {
        if (string.IsNullOrWhiteSpace(instructions))
            return [SingleStep("Instructions", "See the original recipe for full instructions.")];

        // Normalize line endings and split
        var rawLines = instructions
            .Replace("\r\n", "\n")
            .Replace("\r", "\n")
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.Trim())
            .Where(l => l.Length > 10)
            .ToList();

        // If we got reasonable lines, use them
        if (rawLines.Count >= 2)
            return rawLines.Select((line, i) => MakeStep(i + 1, line)).ToList();

        // Try splitting by sentence boundaries
        var sentences = Regex.Split(instructions, @"(?<=[.!?])\s+")
            .Select(s => s.Trim())
            .Where(s => s.Length > 10)
            .ToList();

        if (sentences.Count >= 2)
            return sentences.Select((s, i) => MakeStep(i + 1, s)).ToList();

        // Fallback: single step with the full text (trimmed to reasonable length)
        var clean = instructions.Trim();
        var title = clean.Length > 80 ? "Instructions" : clean[..Math.Min(80, clean.Length)];
        return [SingleStep(title, clean)];
    }

    private static DinnerItemStep MakeStep(int number, string description) =>
        new() { Id = Guid.NewGuid(), StepTitle = $"Step {number}", StepDescription = description };

    private static DinnerItemStep SingleStep(string title, string description) =>
        new() { Id = Guid.NewGuid(), StepTitle = title, StepDescription = description };

    /// <summary>
    /// Maps TheMealDB category and tags to our FoodTag enum.
    /// </summary>
    private static List<FoodTag> MapTags(string? category, string? tags)
    {
        var combined = $"{(category ?? "")} {(tags ?? "")}".ToLowerInvariant();
        var result = new List<FoodTag>();

        if (combined.Contains("vegetarian")) result.Add(FoodTag.Vegetarian);
        if (combined.Contains("vegan")) result.Add(FoodTag.Vegan);
        if (combined.Contains("gluten")) result.Add(FoodTag.GlutenFree);

        // Quick/easy hints
        if (combined.Contains("quick") || combined.Contains("easy") ||
            combined.Contains("breakfast") || combined.Contains("salad"))
            result.Add(FoodTag.Quick);

        // Cheap hints
        if (combined.Contains("budget") || combined.Contains("cheap") ||
            combined.Contains("pasta") || combined.Contains("soup") ||
            combined.Contains("stew") || combined.Contains("bean"))
            result.Add(FoodTag.Cheap);

        // Low carb hints
        if (combined.Contains("keto") || combined.Contains("low carb") ||
            combined.Contains("salad") || combined.Contains("seafood"))
            result.Add(FoodTag.LowCarb);

        // Family-friendly default for comfort food categories
        if (combined.Contains("chicken") || combined.Contains("beef") ||
            combined.Contains("pasta") || combined.Contains("pork") ||
            combined.Contains("comfort") || combined.Contains("casserole"))
            result.Add(FoodTag.FamilyFriendly);

        // Always include at least one tag
        if (result.Count == 0)
            result.Add(FoodTag.Quick);

        return result.Distinct().ToList();
    }

    private static decimal ParseAmount(string? measure)
    {
        if (string.IsNullOrWhiteSpace(measure)) return 1;

        // "to taste" → 0 (free-form quantity)
        if (Regex.IsMatch(measure, @"to\s+taste", RegexOptions.IgnoreCase)) return 0;

        // Handle Unicode fractions: ½, ¼, ¾, ⅓, ⅔, ⅛, ⅜, ⅝, ⅞
        var fractionMap = new Dictionary<char, decimal>
        {
            { '½', 0.5m }, { '¼', 0.25m }, { '¾', 0.75m },
            { '⅓', 1m/3m }, { '⅔', 2m/3m },
            { '⅛', 0.125m }, { '⅜', 0.375m }, { '⅝', 0.625m }, { '⅞', 0.875m }
        };

        // Check for mixed numbers like "1 1/2" or "1½"
        var mixedMatch = Regex.Match(measure, @"(\d+)\s+(\d+)\s*/\s*(\d+)");
        if (mixedMatch.Success)
            return decimal.Parse(mixedMatch.Groups[1].Value)
                   + decimal.Parse(mixedMatch.Groups[2].Value) / decimal.Parse(mixedMatch.Groups[3].Value);

        // Check for simple fraction like "1/2"
        var fracMatch = Regex.Match(measure, @"(\d+)\s*/\s*(\d+)");
        if (fracMatch.Success)
            return decimal.Parse(fracMatch.Groups[1].Value) / decimal.Parse(fracMatch.Groups[2].Value);

        // Check for Unicode fraction character
        foreach (var kvp in fractionMap)
        {
            if (measure.Contains(kvp.Key))
            {
                // Check if preceded by a whole number (e.g., "1½")
                var prefix = Regex.Match(measure, @"(\d+)\s*" + kvp.Key);
                if (prefix.Success)
                    return decimal.Parse(prefix.Groups[1].Value) + kvp.Value;
                return kvp.Value;
            }
        }

        // Handle ranges: take the first number
        var rangeMatch = Regex.Match(measure, @"(\d+)\s*-\s*\d+");
        if (rangeMatch.Success)
            return decimal.Parse(rangeMatch.Groups[1].Value);

        // Standard decimal number
        var match = Regex.Match(measure, @"[\d.]+");
        return match.Success && decimal.TryParse(match.Value, out var amt) ? amt : 1;
    }

    private static Measurement InferMeasurement(string? measure)
    {
        if (string.IsNullOrWhiteSpace(measure)) return Measurement.Amount;
        var m = measure.ToLowerInvariant();

        // Volume
        if (m.Contains("ml") || m.Contains("millilit")) return Measurement.Millilitres;
        if (m.Contains("litre") || m.Contains("liter") || m.Contains(" l ")) return Measurement.Litres;
        if (m.Contains("tsp") || m.Contains("teaspoon")) return Measurement.Teaspoon;
        if (m.Contains("tbsp") || m.Contains("tablespoon")) return Measurement.Tablespoon;
        if (m.Contains("cup")) return Measurement.Cups;

        // Weight — check for "kg" before "g" to avoid false matches
        if (m.Contains("kg") || m.Contains("kilo")) return Measurement.Kilograms;
        // "g" needs word-boundary check to avoid matching "sprigs", "something", etc.
        if (Regex.IsMatch(m, @"\b\d*\s*g\b") || m.Contains("gram")) return Measurement.Grams;
        if (m.Contains("oz") || m.Contains("ounce")) return Measurement.Ounces;
        if (m.Contains("lb") || m.Contains("pound")) return Measurement.Pounds;

        // Count / informal
        if (m.Contains("pinch") || m.Contains("dash")) return Measurement.Pinch;
        if (m.Contains("to taste")) return Measurement.ToTaste;
        if (m.Contains("clove")) return Measurement.Cloves;
        if (m.Contains("slice")) return Measurement.Slices;
        if (m.Contains("bunch") || m.Contains("sprig")) return Measurement.Bunches;
        if (m.Contains("can") || m.Contains("tin")) return Measurement.Cans;

        return Measurement.Amount;
    }
}
