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
}

public class DinnerItemService : IDinnerItemService
{
    private readonly AmazonDynamoDBConfig _clientConfig;
    private readonly AmazonDynamoDBClient _dynamoDBClient;
    private readonly IDynamoObjectService _dynamoObjectService;

    private readonly IDatabaseClientService _databaseClientService;

    public DinnerItemService(IDynamoObjectService dynamoObjectService, IDatabaseClientService databaseClientService)
    {
        _clientConfig = new AmazonDynamoDBConfig
        {
            RegionEndpoint = RegionEndpoint.USWest1,
        };
        _dynamoDBClient = new AmazonDynamoDBClient(_clientConfig);
        _dynamoObjectService = dynamoObjectService;

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
}