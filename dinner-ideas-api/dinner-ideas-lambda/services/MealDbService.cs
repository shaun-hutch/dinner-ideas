using System.Text.RegularExpressions;
using dinner_ideas_lambda.models;
using Newtonsoft.Json;

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
    /// </summary>
    private static DinnerItem MapToDinnerItem(MealDbMeal m)
    {
        // Collect non-empty ingredient/measure pairs
        var ingredientPairs = new (string? Ingredient, string? Measure)[]
        {
            (m.StrIngredient1, m.StrMeasure1),
            (m.StrIngredient2, m.StrMeasure2),
            (m.StrIngredient3, m.StrMeasure3),
            (m.StrIngredient4, m.StrMeasure4),
            (m.StrIngredient5, m.StrMeasure5),
            (m.StrIngredient6, m.StrMeasure6),
            (m.StrIngredient7, m.StrMeasure7),
            (m.StrIngredient8, m.StrMeasure8),
            (m.StrIngredient9, m.StrMeasure9),
            (m.StrIngredient10, m.StrMeasure10),
            (m.StrIngredient11, m.StrMeasure11),
            (m.StrIngredient12, m.StrMeasure12),
            (m.StrIngredient13, m.StrMeasure13),
            (m.StrIngredient14, m.StrMeasure14),
            (m.StrIngredient15, m.StrMeasure15),
            (m.StrIngredient16, m.StrMeasure16),
            (m.StrIngredient17, m.StrMeasure17),
            (m.StrIngredient18, m.StrMeasure18),
            (m.StrIngredient19, m.StrMeasure19),
            (m.StrIngredient20, m.StrMeasure20),
        };

        var ingredients = ingredientPairs
            .Where(p => !string.IsNullOrWhiteSpace(p.Ingredient))
            .Select(p => new Ingredient
            {
                Id = Guid.NewGuid(),
                Name = p.Ingredient!.Trim(),
                Description = string.IsNullOrWhiteSpace(p.Measure) ? "" : p.Measure.Trim(),
                Amount = ParseAmount(p.Measure),
                Measurement = InferMeasurement(p.Measure)
            })
            .ToList();

        // Split instructions into steps by newlines or numbered markers
        var steps = ParseInstructionsToSteps(m.StrInstructions ?? "");

        // Map category/tags to FoodTag enum
        var tags = MapTags(m.StrCategory, m.StrTags);

        // Use a deterministic GUID from the meal ID
        var guid = Guid.Parse("00000000-0000-0000-0000-" + (m.IdMeal ?? "0").PadLeft(12, '0')[..12]);

        return new DinnerItem
        {
            Id = guid,
            Name = m.StrMeal ?? "Unknown Meal",
            Description = m.StrCategory != null
                ? $"A {m.StrCategory.ToLower()} dish from {m.StrArea ?? "around the world"}. Imported from TheMealDB."
                : "Imported from TheMealDB.",
            PrepTime = 15,
            CookTime = 30,
            Steps = ingredients.Any() ? steps.ToArray() : steps.ToArray(),
            Tags = tags.ToArray(),
            Ingredients = ingredients.ToArray(),
            ImageKey = null, // Store the URL separately — frontend will use it directly
            CreatedBy = 0,
            LastModifiedBy = 0,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow,
            Version = 1
        };
    }

    private static List<DinnerItemStep> ParseInstructionsToSteps(string instructions)
    {
        if (string.IsNullOrWhiteSpace(instructions))
            return [new DinnerItemStep { Id = Guid.NewGuid(), StepTitle = "Instructions", StepDescription = "See the original recipe for instructions." }];

        // Split by newlines (\r\n or \n)
        var lines = instructions
            .Replace("\r\n", "\n")
            .Replace("\r", "\n")
            .Split('\n', StringSplitOptions.RemoveEmptyEntries)
            .Select(l => l.Trim())
            .Where(l => l.Length > 10)
            .ToList();

        if (lines.Count == 0)
        {
            // Fallback: split long text by sentences
            lines = Regex.Split(instructions, @"(?<=[.!?])\s+")
                .Select(s => s.Trim())
                .Where(s => s.Length > 10)
                .ToList();
        }

        if (lines.Count == 0)
        {
            return [new DinnerItemStep { Id = Guid.NewGuid(), StepTitle = "Instructions", StepDescription = instructions.Trim() }];
        }

        return lines.Select((line, i) => new DinnerItemStep
        {
            Id = Guid.NewGuid(),
            StepTitle = $"Step {i + 1}",
            StepDescription = line
        }).ToList();
    }

    private static List<FoodTag> MapTags(string? category, string? tags)
    {
        var result = new List<FoodTag>();
        var combined = $"{(category ?? "")},{(tags ?? "")}".ToLowerInvariant();

        if (combined.Contains("vegetarian") || combined.Contains("vegan")) result.Add(FoodTag.Vegetarian);
        if (combined.Contains("vegan")) result.Add(FoodTag.Vegan);
        if (combined.Contains("quick") || combined.Contains("easy")) result.Add(FoodTag.Quick);
        if (combined.Contains("cheap") || combined.Contains("budget")) result.Add(FoodTag.Cheap);
        if (combined.Contains("pasta") || combined.Contains("seafood")) { /* no direct mapping */ }
        if (combined.Contains("gluten")) result.Add(FoodTag.GlutenFree);

        // Default: at least one tag
        if (result.Count == 0)
            result.Add(FoodTag.FamilyFriendly);

        return result;
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
