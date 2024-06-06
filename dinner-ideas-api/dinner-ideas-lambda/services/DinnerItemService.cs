using dinner_ideas_lambda.models;

namespace dinner_ideas_lambda.services;

public interface IDinnerItemService
{
    DinnerItem GetItem(Guid id);
    IEnumerable<DinnerItem> GetItems();
    DinnerItem CreateItem(DinnerItem item);
    DinnerItem UpdateItem(DinnerItem item);
    Boolean DeleteItem(DinnerItem item);
}

public class DinnerItemService : IDinnerItemService
{
    public DinnerItem CreateItem(DinnerItem item)
    {
        throw new NotImplementedException();
    }

    public bool DeleteItem(DinnerItem item)
    {
        throw new NotImplementedException();
    }

    public IEnumerable<DinnerItem> GetItems()
    {
        return new List<DinnerItem>
        {
            new ()
            {
                CookTime = 10,
                CreatedBy = 1,
                CreatedDate = DateTime.UtcNow,
                Description = "test",
                Id = Guid.NewGuid(),
                LastModifiedBy = 1,
                LastModifiedDate = DateTime.UtcNow,
                Name = "test item",
                PrepTime = 10,
                Version = 1
            }
        };
    }

    public DinnerItem GetItem(Guid id)
    {
        return new DinnerItem ()
        {
            CookTime = 10,
            CreatedBy = 1,
            CreatedDate = DateTime.UtcNow,
            Description = "test",
            Id = Guid.NewGuid(),
            LastModifiedBy = 1,
            LastModifiedDate = DateTime.UtcNow,
            Name = "test item",
            PrepTime = 10,
            Version = 1
        };
    }

    public DinnerItem UpdateItem(DinnerItem item)
    {
        throw new NotImplementedException();
    }
}