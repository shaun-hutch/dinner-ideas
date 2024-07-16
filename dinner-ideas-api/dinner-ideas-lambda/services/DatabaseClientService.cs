using System.Net;
using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using dinner_ideas_lambda.models;

namespace dinner_ideas_lambda.services;

public interface IDatabaseClientService
{
    Task<T> GetItem<T>(Guid id) where T : BaseItem;
    Task<IEnumerable<T>> GetItems<T>(int ownerId) where T : BaseItem;
    Task<T> CreateItem<T>(T item) where T : BaseItem;
    Task<T> UpdateItem<T>(T item) where T : BaseItem;
    Task<bool> DeleteItem<T>(Guid id) where T : BaseItem;
}

public class DatabaseClientService : IDatabaseClientService
{
    private readonly AmazonDynamoDBConfig _clientConfig;
    private readonly AmazonDynamoDBClient _dynamoDBClient;
    private readonly IDynamoObjectService _dynamoObjectService;

    public DatabaseClientService(IDynamoObjectService dynamoObjectService)
    {
        _clientConfig = new AmazonDynamoDBConfig
        {
            RegionEndpoint = RegionEndpoint.USWest1,
        };
        _dynamoDBClient = new AmazonDynamoDBClient(_clientConfig);
        _dynamoObjectService = dynamoObjectService;
    }

    public async Task<T> CreateItem<T>(T item) where T : BaseItem
    {
        item.Id = Guid.NewGuid();

        var utcNow = DateTime.UtcNow;

        item.LastModifiedBy = item.CreatedBy;
        item.CreatedDate = utcNow;
        item.LastModifiedDate = utcNow;

        var dict = _dynamoObjectService.ToAttributeMap(item);
        var response = await _dynamoDBClient.PutItemAsync(Constants.TABLE_NAME, dict);

        if (response.HttpStatusCode != HttpStatusCode.OK)
            throw new Exception($"Error creating {typeof(T)}, Status code: {response.HttpStatusCode}");

        return item;
    }

    public async Task<bool> DeleteItem<T>(Guid id) where T : BaseItem
    {
        var existingItem = await GetItem<T>(id);
        if (existingItem is null)
            return false;

        var response = await _dynamoDBClient.DeleteItemAsync(Constants.TABLE_NAME, new ()
        {
            { "typeAndId", new () { S = existingItem.TypeAndId }}
        });

        if (response.HttpStatusCode is HttpStatusCode.OK or HttpStatusCode.NotFound)
        {
            return true;
        }
        
        throw new Exception($"Unable to delete {typeof(T)}, Status code: {response.HttpStatusCode}");
    }

    public async Task<T> GetItem<T>(Guid id) where T : BaseItem
    {
        var typeAndId = _dynamoObjectService.CreateIdKey<T>(id);
        var request = new GetItemRequest
        {
            TableName = Constants.TABLE_NAME,
            Key = new ()
            {
                { 
                    Constants.ID_KEY, 
                    new AttributeValue() { S = typeAndId }
                }
            }
        };

        var response = await _dynamoDBClient.GetItemAsync(request);

        if (response.Item.Count != 0)
            return _dynamoObjectService.FromAttributeMap<T>(response.Item);
        else 
        {
            Console.WriteLine($"No item found for {typeAndId}");
            return null;
        }
    }

    public async Task<IEnumerable<T>> GetItems<T>(int ownerId) where T : BaseItem
    {
        var request = new ScanRequest ()
        {
            TableName = Constants.TABLE_NAME,
            FilterExpression = "#cb = :createdByValue",
            ExpressionAttributeNames = new ()
            {
                { "#cb", "createdBy" }
            },
            ExpressionAttributeValues = new ()
            {
                { ":createdByValue", new () { N = ownerId.ToString() }}
            }
        };

        var response = await _dynamoDBClient.ScanAsync(request);

        Console.WriteLine(response.Items.Count);

        var result = new List<T>();
        if (response.Items.Count > 0)
            foreach (var item in response.Items)
            {
                var converted = _dynamoObjectService.FromAttributeMap<T>(item);
                result.Add(converted);
            }

        return result;
    }

    public async Task<T> UpdateItem<T>(T item) where T : BaseItem
    {
        var utcNow = DateTime.UtcNow;

        var existingItem = await GetItem<T>(item.Id);
        if (existingItem is null)
            throw new ArgumentNullException(nameof(item));

        item.CreatedDate = utcNow;
        item.LastModifiedDate = utcNow;

        var dict = _dynamoObjectService.ToAttributeMap(item);
        var response = await _dynamoDBClient.PutItemAsync(Constants.TABLE_NAME, dict);

        if (response.HttpStatusCode != HttpStatusCode.OK)
            throw new Exception($"No id in response attributes");

        return item;
    }
}
