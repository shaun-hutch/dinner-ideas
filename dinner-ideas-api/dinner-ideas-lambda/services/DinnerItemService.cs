using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using dinner_ideas_lambda.models;
using Newtonsoft.Json;
using System.Net;

namespace dinner_ideas_lambda.services;

public interface IDinnerItemService
{
    Task<DinnerItem> GetItem(Guid id);
    Task<IEnumerable<DinnerItem>> GetItems(int ownerId = 1);
    Task<DinnerItem> CreateItem(DinnerItem item);
    Task<DinnerItem> UpdateItem(DinnerItem item);
    Task<bool> DeleteItem(Guid id);

    Task<IEnumerable<DinnerItem>> GenerateItems(int count);
}

public class DinnerItemService : IDinnerItemService
{
    private readonly IDatabaseClientService _databaseClientService;

    public DinnerItemService(IDatabaseClientService databaseClientService)
    {
        _databaseClientService = databaseClientService;
    }

    public async Task<DinnerItem> CreateItem(DinnerItem item)
    {
        try 
        {
            return await _databaseClientService.CreateItem(item);
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unable to create item, Exception: {ex}");
            throw;
        }
    }

    public async Task<bool> DeleteItem(Guid id)
    {
        try 
        {
            return await _databaseClientService.DeleteItem<DinnerItem>(id);
        }
        catch (Exception ex)
        {
            Console.WriteLine("Unable to delete dinner item", ex);
            throw;
        }
    }

    public async Task<IEnumerable<DinnerItem>> GetItems(int ownerId = 1)
    {
        try 
        {
            var resultList = await _databaseClientService.GetItems<DinnerItem>(ownerId) as List<DinnerItem>;

            return resultList ?? [];
        }
        catch (Exception ex)
        {
            Console.WriteLine("Unable to get Dinner item", ex);
            throw;
        }
    }

    public async Task<DinnerItem> GetItem(Guid id)
    {
        try 
        {
            var result = await _databaseClientService.GetItem<DinnerItem>(id);
            
            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine("Unable to get Dinner item", ex);
            throw;
        }
    }

    public async Task<DinnerItem> UpdateItem(DinnerItem item)
    {
        try 
        {
            var result = await _databaseClientService.UpdateItem(item);

            return result;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unable to create item, Exception: {ex}");
            throw;
        }
    }

    public async Task<IEnumerable<DinnerItem>> GenerateItems(int count)
    {
        var allItems = await GetItems();

        var random = new Random();
        var generatedItems = allItems.OrderBy(x => random.Next()).Take(count);

        Console.WriteLine($"Generated {count} items");

        return generatedItems;
    }
}