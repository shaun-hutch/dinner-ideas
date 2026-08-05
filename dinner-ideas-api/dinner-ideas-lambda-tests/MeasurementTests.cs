using Xunit;
using dinner_ideas_lambda.models;
using dinner_ideas_lambda.services;

namespace dinner_ideas_lambda.Tests;

/// <summary>
/// Pure unit tests for measurement parsing logic in MealDbService.
/// Tests InferMeasurement, ParseAmount, and CleanIngredientName via ExtractIngredients.
/// </summary>
public class MeasurementTests
{
    // ── InferMeasurement ──────────────────────────────────────────────

    [Theory]
    [InlineData("200ml", Measurement.Millilitres)]
    [InlineData("500 millilitres", Measurement.Millilitres)]
    [InlineData("2 tsp", Measurement.Teaspoon)]
    [InlineData("1 teaspoon", Measurement.Teaspoon)]
    [InlineData("3 tbsp", Measurement.Tablespoon)]
    [InlineData("2 tablespoons", Measurement.Tablespoon)]
    [InlineData("500g", Measurement.Grams)]
    [InlineData("200 grams", Measurement.Grams)]
    [InlineData("1 cup", Measurement.Cups)]
    [InlineData("2 cups", Measurement.Cups)]
    [InlineData("8 oz", Measurement.Ounces)]
    [InlineData("16 ounces", Measurement.Ounces)]
    [InlineData("1 lb", Measurement.Pounds)]
    [InlineData("2 pounds", Measurement.Pounds)]
    [InlineData("pinch", Measurement.Pinch)]
    [InlineData("a dash", Measurement.Pinch)]
    [InlineData("to taste", Measurement.ToTaste)]
    [InlineData("1 litre", Measurement.Litres)]
    [InlineData("2 liters", Measurement.Litres)]
    [InlineData("1 kg", Measurement.Kilograms)]
    [InlineData("2 kilos", Measurement.Kilograms)]
    [InlineData("2 slices", Measurement.Slices)]
    [InlineData("3 cloves", Measurement.Cloves)]
    [InlineData("1 bunch", Measurement.Bunches)]
    [InlineData("a few sprigs", Measurement.Bunches)]
    [InlineData("1 can", Measurement.Cans)]
    [InlineData("1 tin", Measurement.Cans)]
    [InlineData("", Measurement.Amount)]
    [InlineData("1", Measurement.Amount)]
    [InlineData("some", Measurement.Amount)]
    public void InferMeasurement_ReturnsCorrectEnum(string measure, Measurement expected)
    {
        // Use reflection to call private static method
        var method = typeof(MealDbService).GetMethod("InferMeasurement",
            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);
        Assert.NotNull(method);
        var result = method!.Invoke(null, new object?[] { measure });
        Assert.Equal(expected, result);
    }

    // ── ParseAmount ───────────────────────────────────────────────────

    [Theory]
    [InlineData("500g", 500)]
    [InlineData("1.5 cups", 1.5)]
    [InlineData("1 1/2 cups", 1.5)]
    [InlineData("2 1/4 tsp", 2.25)]
    [InlineData("1/2 cup", 0.5)]
    [InlineData("1/4 tsp", 0.25)]
    [InlineData("3/4 tbsp", 0.75)]
    [InlineData("to taste", 0)]
    [InlineData("To Taste", 0)]
    [InlineData("1-2 cloves", 1)]
    [InlineData("2-3 slices", 2)]
    [InlineData("", 1)]
    [InlineData("some", 1)]
    [InlineData("a few", 1)]
    public void ParseAmount_ReturnsCorrectValue(string measure, decimal expected)
    {
        var method = typeof(MealDbService).GetMethod("ParseAmount",
            System.Reflection.BindingFlags.NonPublic | System.Reflection.BindingFlags.Static);
        Assert.NotNull(method);
        var result = method!.Invoke(null, new object?[] { measure });
        Assert.Equal(expected, result);
    }

    // ── ExtractIngredients integration ────────────────────────────────

    [Fact]
    public void ExtractIngredients_HandlesCups()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Flour",
            StrMeasure1 = "2 cups"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal("Flour", result[0].Name);
        Assert.Equal(2m, result[0].Amount);
        Assert.Equal(Measurement.Cups, result[0].Measurement);
    }

    [Fact]
    public void ExtractIngredients_HandlesToTaste()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Salt",
            StrMeasure1 = "to taste"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal("Salt", result[0].Name);
        Assert.Equal(0m, result[0].Amount);
        Assert.Equal(Measurement.ToTaste, result[0].Measurement);
        Assert.Equal("to taste", result[0].Quantity);
    }

    [Fact]
    public void ExtractIngredients_HandlesOunces()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Cheese",
            StrMeasure1 = "8 oz"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal("Cheese", result[0].Name);
        Assert.Equal(8m, result[0].Amount);
        Assert.Equal(Measurement.Ounces, result[0].Measurement);
    }

    [Fact]
    public void ExtractIngredients_HandlesFraction()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Sugar",
            StrMeasure1 = "1/2 cup"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal(0.5m, result[0].Amount);
    }

    [Fact]
    public void ExtractIngredients_HandlesMixedFraction()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Flour",
            StrMeasure1 = "1 1/2 cups"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal(1.5m, result[0].Amount);
    }

    [Fact]
    public void ExtractIngredients_HandlesPinch()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Black Pepper",
            StrMeasure1 = "a pinch"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal(Measurement.Pinch, result[0].Measurement);
    }

    [Fact]
    public void ExtractIngredients_HandlesCloves()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Garlic",
            StrMeasure1 = "3 cloves"
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        Assert.Equal(3m, result[0].Amount);
        Assert.Equal(Measurement.Cloves, result[0].Measurement);
    }

    [Fact]
    public void ExtractIngredients_CleansQuantityPrefixFromName()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "2 cloves of garlic",
            StrMeasure1 = ""
        };
        var result = MealDbService.ExtractIngredients(meal);

        Assert.Single(result);
        // Name should be cleaned of the quantity prefix
        Assert.Contains("garlic", result[0].Name.ToLowerInvariant());
    }

    [Fact]
    public void ExtractIngredients_AllNewMeasurements_AreValidEnumValues()
    {
        // Ensure all new enum values are defined
        var values = Enum.GetValues<Measurement>();
        Assert.Contains(Measurement.Cups, values);
        Assert.Contains(Measurement.Ounces, values);
        Assert.Contains(Measurement.Pounds, values);
        Assert.Contains(Measurement.Pinch, values);
        Assert.Contains(Measurement.ToTaste, values);
        Assert.Contains(Measurement.Litres, values);
        Assert.Contains(Measurement.Kilograms, values);
        Assert.Contains(Measurement.Slices, values);
        Assert.Contains(Measurement.Cloves, values);
        Assert.Contains(Measurement.Bunches, values);
        Assert.Contains(Measurement.Cans, values);
    }
}
