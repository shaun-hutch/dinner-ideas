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
    /// </summary>
    internal static DinnerItem MapToDinnerItem(MealDbMeal m)
    {
        // Extract ingredients via reflection — TheMealDB uses strIngredient1..20 + strMeasure1..20
        var ingredients = ExtractIngredients(m);

        // Parse instructions into numbered steps
        var steps = ParseInstructionsToSteps(m.StrInstructions ?? "");

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

            ingredients.Add(new Ingredient
            {
                Id = Guid.NewGuid(),
                Name = name.Trim(),
                Description = string.IsNullOrWhiteSpace(measure) ? "" : measure.Trim(),
                Amount = ParseAmount(measure),
                Measurement = InferMeasurement(measure)
            });
        }

        return ingredients;
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
        var match = Regex.Match(measure, @"[\d.]+");
        return match.Success && decimal.TryParse(match.Value, out var amt) ? amt : 1;
    }

    private static Measurement InferMeasurement(string? measure)
    {
        if (string.IsNullOrWhiteSpace(measure)) return Measurement.Amount;
        var m = measure.ToLowerInvariant();

        if (m.Contains("ml") || m.Contains("millilit")) return Measurement.Millilitres;
        if (m.Contains("tsp") || m.Contains("teaspoon")) return Measurement.Teaspoon;
        if (m.Contains("tbsp") || m.Contains("tablespoon")) return Measurement.Tablespoon;
        if (m.Contains("g") || m.Contains("gram") || m.Contains("kg") || m.Contains("kilo")
            || m.Contains("oz") || m.Contains("ounce") || m.Contains("lb") || m.Contains("pound"))
            return Measurement.Grams;

        return Measurement.Amount;
    }
}
