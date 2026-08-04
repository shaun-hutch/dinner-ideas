using Xunit;
using dinner_ideas_lambda.models;
using dinner_ideas_lambda.services;

namespace dinner_ideas_lambda.Tests;

public class MealDbServiceTests
{
    [Fact]
    public void ExtractIngredients_WithAll20FieldsEmpty_ReturnsEmptyList()
    {
        var meal = new MealDbMeal();
        var result = MealDbService.ExtractIngredients(meal);
        Assert.Empty(result);
    }

    [Fact]
    public void ExtractIngredients_WithThreeIngredients_ReturnsThree()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Chicken Breast",
            StrMeasure1 = "500g",
            StrIngredient2 = "Olive Oil",
            StrMeasure2 = "2 tbsp",
            StrIngredient3 = "Garlic",
            StrMeasure3 = "3 cloves"
        };

        var result = MealDbService.ExtractIngredients(meal);

        Assert.Equal(3, result.Count);
        Assert.Equal("Chicken Breast", result[0].Name);
        Assert.Equal("500g", result[0].Description);
        Assert.Equal(500m, result[0].Amount);
        Assert.Equal(Measurement.Grams, result[0].Measurement);

        Assert.Equal("Olive Oil", result[1].Name);
        Assert.Equal(2m, result[1].Amount);

        Assert.Equal("Garlic", result[2].Name);
        Assert.Equal(3m, result[2].Amount);
    }

    [Fact]
    public void ExtractIngredients_SkipsEmptyIngredientFields()
    {
        var meal = new MealDbMeal
        {
            StrIngredient1 = "Rice",
            StrMeasure1 = "200g",
            // StrIngredient2 is null/empty — should be skipped
            StrIngredient3 = "Salt",
            StrMeasure3 = "1 tsp"
        };

        var result = MealDbService.ExtractIngredients(meal);

        Assert.Equal(2, result.Count);
        Assert.Equal("Rice", result[0].Name);
        Assert.Equal("Salt", result[1].Name);
    }

    [Fact]
    public void MapToDinnerItem_WithValidMeal_ReturnsPopulatedItem()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "52772",
            StrMeal = "Teriyaki Chicken",
            StrCategory = "Chicken",
            StrArea = "Japanese",
            StrInstructions = "Step one. Step two. Step three.",
            StrMealThumb = "https://www.themealdb.com/images/meal.jpg",
            StrTags = "Quick,Easy",
            StrIngredient1 = "Chicken",
            StrMeasure1 = "500g"
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.Equal("Teriyaki Chicken", result.Name);
        Assert.Contains("Japanese", result.Description);
        Assert.NotEmpty(result.Steps);
        Assert.NotEmpty(result.Tags);
        Assert.Single(result.Ingredients);
        Assert.Equal("https://www.themealdb.com/images/meal.jpg", result.ImageKey);
    }

    [Fact]
    public void MapToDinnerItem_WithNoCategory_StillReturnsValidItem()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "00001",
            StrMeal = "Unknown Dish",
            StrInstructions = "Cook it.",
            StrIngredient1 = "Mystery Meat",
            StrMeasure1 = "1 portion"
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.Equal("Unknown Dish", result.Name);
        Assert.NotEmpty(result.Description); // Should have fallback
        Assert.NotEmpty(result.Tags); // Should have at least one default tag
        Assert.NotEmpty(result.Steps);
    }

    [Fact]
    public void ParseInstructions_WithNewlines_SplitsCorrectly()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "1",
            StrMeal = "Test",
            StrInstructions = "Preheat oven to 180C.\r\nMix ingredients in a bowl.\r\nBake for 20 minutes."
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.True(result.Steps.Length >= 2,
            $"Expected at least 2 steps, got {result.Steps.Length}");
    }

    [Fact]
    public void MeasurementInference_CorrectlyIdentifiesGrams()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "1",
            StrMeal = "Test",
            StrIngredient1 = "Flour",
            StrMeasure1 = "250g"
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.Equal(Measurement.Grams, result.Ingredients[0].Measurement);
        Assert.Equal(250m, result.Ingredients[0].Amount);
    }

    [Fact]
    public void MeasurementInference_CorrectlyIdentifiesMillilitres()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "1",
            StrMeal = "Test",
            StrIngredient1 = "Milk",
            StrMeasure1 = "200ml"
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.Equal(Measurement.Millilitres, result.Ingredients[0].Measurement);
        Assert.Equal(200m, result.Ingredients[0].Amount);
    }

    [Fact]
    public void MeasurementInference_CorrectlyIdentifiesTeaspoon()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "1",
            StrMeal = "Test",
            StrIngredient1 = "Salt",
            StrMeasure1 = "1 tsp"
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.Equal(Measurement.Teaspoon, result.Ingredients[0].Measurement);
    }

    [Fact]
    public void MeasurementInference_CorrectlyIdentifiesTablespoon()
    {
        var meal = new MealDbMeal
        {
            IdMeal = "1",
            StrMeal = "Test",
            StrIngredient1 = "Oil",
            StrMeasure1 = "2 tbsp"
        };

        var result = MealDbService.MapToDinnerItem(meal);

        Assert.Equal(Measurement.Tablespoon, result.Ingredients[0].Measurement);
    }

    [Fact]
    public void MapToDinnerItem_DeterministicGuid_BasedOnMealId()
    {
        var meal1 = new MealDbMeal { IdMeal = "52772", StrMeal = "A", StrInstructions = "X" };
        var meal2 = new MealDbMeal { IdMeal = "52772", StrMeal = "B", StrInstructions = "Y" };
        var meal3 = new MealDbMeal { IdMeal = "52773", StrMeal = "C", StrInstructions = "Z" };

        var r1 = MealDbService.MapToDinnerItem(meal1);
        var r2 = MealDbService.MapToDinnerItem(meal2);
        var r3 = MealDbService.MapToDinnerItem(meal3);

        // Same meal ID → same GUID
        Assert.Equal(r1.Id, r2.Id);
        // Different meal ID → different GUID
        Assert.NotEqual(r1.Id, r3.Id);
    }
}
