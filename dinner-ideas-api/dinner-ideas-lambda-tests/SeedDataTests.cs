using Xunit;
using dinner_ideas_lambda.services;
using dinner_ideas_lambda.models;

namespace dinner_ideas_lambda.Tests;

public class SeedDataTests
{
    [Fact]
    public void GetSeedRecipes_ReturnsExactlySevenRecipes()
    {
        var recipes = SeedData.GetSeedRecipes();
        Assert.Equal(7, recipes.Count);
    }

    [Fact]
    public void EachRecipe_HasRequiredFields()
    {
        var recipes = SeedData.GetSeedRecipes();

        foreach (var r in recipes)
        {
            Assert.False(string.IsNullOrWhiteSpace(r.Name),
                $"Recipe '{r.Id}' has empty Name");
            Assert.False(string.IsNullOrWhiteSpace(r.Description),
                $"Recipe '{r.Name}' has empty Description");
            Assert.True(r.PrepTime >= 0,
                $"Recipe '{r.Name}' has negative PrepTime");
            Assert.True(r.CookTime >= 0,
                $"Recipe '{r.Name}' has negative CookTime");
            Assert.NotEmpty(r.Steps);
            Assert.NotEmpty(r.Tags);
        }
    }

    [Fact]
    public void EachRecipe_HasValidSteps()
    {
        var recipes = SeedData.GetSeedRecipes();

        foreach (var r in recipes)
        {
            Assert.InRange(r.Steps.Length, 1, 20);
            foreach (var step in r.Steps)
            {
                Assert.False(string.IsNullOrWhiteSpace(step.StepTitle),
                    $"Recipe '{r.Name}' step has empty title");
                Assert.False(string.IsNullOrWhiteSpace(step.StepDescription),
                    $"Recipe '{r.Name}' step '{step.StepTitle}' has empty description");
                Assert.NotEqual(Guid.Empty, step.Id);
            }
        }
    }

    [Fact]
    public void EachRecipe_HasValidIngredients()
    {
        var recipes = SeedData.GetSeedRecipes();

        foreach (var r in recipes)
        {
            Assert.NotEmpty(r.Ingredients);
            foreach (var ing in r.Ingredients)
            {
                Assert.False(string.IsNullOrWhiteSpace(ing.Name),
                    $"Recipe '{r.Name}' ingredient has empty name");
                Assert.True(ing.Amount > 0,
                    $"Recipe '{r.Name}' ingredient '{ing.Name}' has non-positive amount");
                Assert.NotEqual(Guid.Empty, ing.Id);
            }
        }
    }

    [Fact]
    public void EachRecipe_HasAtLeastOneTag()
    {
        var recipes = SeedData.GetSeedRecipes();

        foreach (var r in recipes)
        {
            Assert.NotEmpty(r.Tags);
            // Tags should be valid enum values
            foreach (var tag in r.Tags)
            {
                Assert.True(Enum.IsDefined(typeof(FoodTag), tag),
                    $"Recipe '{r.Name}' has invalid tag value: {tag}");
            }
        }
    }

    [Fact]
    public void Recipes_HaveUniqueNames()
    {
        var recipes = SeedData.GetSeedRecipes();
        var names = recipes.Select(r => r.Name).ToList();
        Assert.Equal(names.Count, names.Distinct().Count());
    }

    [Fact]
    public void Recipes_HaveReasonableTimings()
    {
        var recipes = SeedData.GetSeedRecipes();

        foreach (var r in recipes)
        {
            var total = r.PrepTime + r.CookTime;
            Assert.InRange(total, 5, 180); // No recipe should take > 3 hours
        }
    }
}
