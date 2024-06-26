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
            item.Id = Guid.NewGuid();

            var utcNow = DateTime.UtcNow;

            item.LastModifiedBy = item.CreatedBy;
            item.CreatedDate = utcNow;
            item.LastModifiedDate = utcNow;
            Console.WriteLine(item.TypeAndId);

            Console.WriteLine(JsonConvert.SerializeObject(item));

            var dict = _dynamoObjectService.ToAttributeMap(item);
            var response = await _dynamoDBClient.PutItemAsync(Constants.TABLE_NAME, dict);

            Console.WriteLine(JsonConvert.SerializeObject(response));
            
            if (response.HttpStatusCode != HttpStatusCode.OK)
                throw new Exception($"No id in response attributes");

            return item;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unable to create item, Exception: {ex}");
            throw;
        }
    }

    public async Task<bool> DeleteItem(Guid id)
    {
        var item = await GetItem(id);

        if (item == null) 
            return false;

        var response = await _dynamoDBClient.DeleteItemAsync(Constants.TABLE_NAME, new ()
        {
            { "typeAndId", new () { S = item.TypeAndId }}
        });

        Console.WriteLine(response);

        return true;
    }

    public async Task<IEnumerable<DinnerItem>> GetItems(int ownerId = 1)
    {
        var request = new ScanRequest ()
        {
            TableName = Constants.TABLE_NAME,
            FilterExpression = $"createdBy = :createdBy",
            ExpressionAttributeValues = new ()
            {
                { ":createdBy", new () { N = ownerId.ToString() }}
            }
        };

        var response = await _dynamoDBClient.ScanAsync(request);
        Console.WriteLine($"Item count: {response.Items.Count}");

        if (response.Items.Count > 0)
            return response.Items.Select(_dynamoObjectService.FromAttributeMap<DinnerItem>);

        return [];
    }

    public async Task<DinnerItem> GetItem(Guid id)
    {
        try 
        {
            var item = await _databaseClientService.GetItem<DinnerItem>(id);
            
            return item;
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
            var utcNow = DateTime.UtcNow;

            item.CreatedDate = utcNow;
            item.LastModifiedDate = utcNow;
            Console.WriteLine(item.TypeAndId);

            Console.WriteLine(JsonConvert.SerializeObject(item));

            var dict = _dynamoObjectService.ToAttributeMap(item);
            var response = await _dynamoDBClient.PutItemAsync(Constants.TABLE_NAME, dict);

            Console.WriteLine(JsonConvert.SerializeObject(response));
            
            if (response.HttpStatusCode != HttpStatusCode.OK)
                throw new Exception($"No id in response attributes");

            return item;
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unable to create item, Exception: {ex}");
            throw;
        }
    }
}