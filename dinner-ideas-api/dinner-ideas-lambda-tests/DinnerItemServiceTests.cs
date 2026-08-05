using Moq;
using Xunit;
using dinner_ideas_lambda.models;
using dinner_ideas_lambda.services;

namespace dinner_ideas_lambda.Tests;

/// <summary>
/// Unit tests for DinnerItemService using Moq to mock IDatabaseClientService.
/// </summary>
public class DinnerItemServiceTests
{
    private readonly Mock<IDatabaseClientService> _dbMock;
    private readonly DinnerItemService _sut;

    public DinnerItemServiceTests()
    {
        _dbMock = new Mock<IDatabaseClientService>();
        _sut = new DinnerItemService(_dbMock.Object);
    }

    private static DinnerItem SampleItem(Guid? id = null) => new()
    {
        Id = id ?? Guid.NewGuid(),
        Name = "Test Recipe",
        Description = "A test recipe",
        PrepTime = 10,
        CookTime = 20,
        Steps = [new DinnerItemStep { Id = Guid.NewGuid(), StepTitle = "Step 1", StepDescription = "Do something" }],
        Tags = [FoodTag.Quick],
        Ingredients = [new Ingredient { Id = Guid.NewGuid(), Name = "Test Ingredient", Amount = 1, Measurement = Measurement.Amount }],
        CreatedBy = 1,
        LastModifiedBy = 1,
        CreatedDate = DateTime.UtcNow,
        LastModifiedDate = DateTime.UtcNow,
        Version = 1
    };

    // ── CreateItem ────────────────────────────────────────────────────

    [Fact]
    public async Task CreateItem_ReturnsItem()
    {
        var item = SampleItem();
        _dbMock.Setup(db => db.CreateItem(It.IsAny<DinnerItem>()))
               .ReturnsAsync(item);

        var result = await _sut.CreateItem(item);

        Assert.NotNull(result);
        Assert.Equal(item.Name, result.Name);
        _dbMock.Verify(db => db.CreateItem(It.IsAny<DinnerItem>()), Times.Once);
    }

    [Fact]
    public async Task CreateItem_Throws_WhenDbFails()
    {
        var item = SampleItem();
        _dbMock.Setup(db => db.CreateItem(It.IsAny<DinnerItem>()))
               .ThrowsAsync(new Exception("DB error"));

        await Assert.ThrowsAsync<Exception>(() => _sut.CreateItem(item));
    }

    // ── GetItem ───────────────────────────────────────────────────────

    [Fact]
    public async Task GetItem_ReturnsItem_WhenFound()
    {
        var id = Guid.NewGuid();
        var item = SampleItem(id);
        _dbMock.Setup(db => db.GetItem<DinnerItem>(id))
               .ReturnsAsync((DinnerItem?)item);

        var result = await _sut.GetItem(id);

        Assert.NotNull(result);
        Assert.Equal(id, result.Id);
        Assert.Equal("Test Recipe", result.Name);
    }

    [Fact]
    public async Task GetItem_ReturnsNull_WhenNotFound()
    {
        var id = Guid.NewGuid();
        _dbMock.Setup(db => db.GetItem<DinnerItem>(id))
               .ReturnsAsync((DinnerItem?)null);

        var result = await _sut.GetItem(id);

        Assert.Null(result);
    }

    // ── GetItems ──────────────────────────────────────────────────────

    [Fact]
    public async Task GetItems_ReturnsFilteredList()
    {
        var items = new List<DinnerItem> { SampleItem(), SampleItem() };
        _dbMock.Setup(db => db.GetItems<DinnerItem>(1))
               .ReturnsAsync(items);

        var result = await _sut.GetItems(1);

        Assert.Equal(2, result.Count());
    }

    [Fact]
    public async Task GetItems_ReturnsEmpty_WhenNoItems()
    {
        _dbMock.Setup(db => db.GetItems<DinnerItem>(1))
               .ReturnsAsync(new List<DinnerItem>());

        var result = await _sut.GetItems(1);

        Assert.Empty(result);
    }

    // ── UpdateItem ────────────────────────────────────────────────────

    [Fact]
    public async Task UpdateItem_UpdatesAndReturns()
    {
        var id = Guid.NewGuid();
        var updated = SampleItem(id);
        updated.Name = "Updated Recipe";

        _dbMock.Setup(db => db.UpdateItem(It.IsAny<DinnerItem>()))
               .ReturnsAsync(updated);

        var result = await _sut.UpdateItem(updated);

        Assert.NotNull(result);
        Assert.Equal("Updated Recipe", result.Name);
        _dbMock.Verify(db => db.UpdateItem(It.Is<DinnerItem>(i => i.Name == "Updated Recipe")), Times.Once);
    }

    [Fact]
    public async Task UpdateItem_Throws_WhenDbFails()
    {
        var id = Guid.NewGuid();
        var item = SampleItem(id);
        _dbMock.Setup(db => db.UpdateItem(It.IsAny<DinnerItem>()))
               .ThrowsAsync(new Exception("DB error"));

        await Assert.ThrowsAsync<Exception>(() => _sut.UpdateItem(item));
    }

    // ── DeleteItem ────────────────────────────────────────────────────

    [Fact]
    public async Task DeleteItem_ReturnsTrue_WhenExists()
    {
        var id = Guid.NewGuid();
        _dbMock.Setup(db => db.DeleteItem<DinnerItem>(id))
               .ReturnsAsync(true);

        var result = await _sut.DeleteItem(id);

        Assert.True(result);
    }

    [Fact]
    public async Task DeleteItem_ReturnsFalse_WhenNotExists()
    {
        var id = Guid.NewGuid();
        _dbMock.Setup(db => db.DeleteItem<DinnerItem>(id))
               .ReturnsAsync(false);

        var result = await _sut.DeleteItem(id);

        Assert.False(result);
    }

    // ── GenerateItems ─────────────────────────────────────────────────

    [Fact]
    public async Task GenerateItems_ReturnsRequestedCount()
    {
        var items = Enumerable.Range(0, 10).Select(_ => SampleItem()).ToList();
        _dbMock.Setup(db => db.GetItems<DinnerItem>(1))
               .ReturnsAsync(items);

        var result = await _sut.GenerateItems(5);

        Assert.Equal(5, result.Count());
    }

    [Fact]
    public async Task GenerateItems_ReturnsAll_WhenCountExceedsAvailable()
    {
        var items = new List<DinnerItem> { SampleItem(), SampleItem() };
        _dbMock.Setup(db => db.GetItems<DinnerItem>(1))
               .ReturnsAsync(items);

        var result = await _sut.GenerateItems(5);

        Assert.Equal(2, result.Count());
    }

    // ── Ingredient & Step association persistence ─────────────────────

    [Fact]
    public async Task CreateItem_PreservesIngredientStepAssociations()
    {
        var stepId = Guid.NewGuid();
        var ingredientId = Guid.NewGuid();
        var item = new DinnerItem
        {
            Id = Guid.NewGuid(),
            Name = "Step-Associated Recipe",
            Description = "Has step associations",
            PrepTime = 10,
            CookTime = 20,
            Steps = [
                new DinnerItemStep
                {
                    Id = stepId,
                    StepTitle = "Main Step",
                    StepDescription = "Cook the thing",
                    IngredientIds = [ingredientId]
                }
            ],
            Tags = [FoodTag.Quick],
            Ingredients = [
                new Ingredient
                {
                    Id = ingredientId,
                    Name = "Main Ingredient",
                    Amount = 2,
                    Measurement = Measurement.Cups,
                    StepId = stepId
                }
            ],
            CreatedBy = 1,
            LastModifiedBy = 1,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow,
            Version = 1
        };

        _dbMock.Setup(db => db.CreateItem(It.IsAny<DinnerItem>()))
               .ReturnsAsync(item);

        var result = await _sut.CreateItem(item);

        Assert.NotNull(result);
        Assert.Single(result.Ingredients);
        Assert.Equal(stepId, result.Ingredients[0].StepId);
        Assert.Equal(Measurement.Cups, result.Ingredients[0].Measurement);
        Assert.Single(result.Steps);
        Assert.Contains(ingredientId, result.Steps[0].IngredientIds);
    }
}
