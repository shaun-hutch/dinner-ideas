using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using dinner_ideas_lambda.models;

namespace dinner_ideas_lambda.services;

public interface IDatabaseClientService
{
    Task<T> GetItem<T>(Guid id) where T : BaseItem;
    Task<T> GetItems<T>(int ownerId) where T : BaseItem;
    Task<T> CreateItem<T>(T item) where T : BaseItem;
    Task<T> UpdateItem<T>(T item) where T : BaseItem;
    Task<bool> DeleteItem(Guid id);
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

    public Task<T> CreateItem<T>(T item) where T : BaseItem
    {
        throw new NotImplementedException();
    }

    public Task<bool> DeleteItem(Guid id)
    {
        throw new NotImplementedException();
    }

    public async Task<T> GetItem<T>(Guid id) where T : BaseItem
    {
        var typeAndId = _dynamoObjectService.CreateIdKey<DinnerItem>(id);
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
            throw new Exception($"No item found for {typeAndId}");
    }

    public Task<T> GetItems<T>(int ownerId) where T : BaseItem
    {
        throw new NotImplementedException();
    }

    public Task<T> UpdateItem<T>(T item) where T : BaseItem
    {
        throw new NotImplementedException();
    }
}
