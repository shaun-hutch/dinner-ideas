using Amazon;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using dinner_ideas_lambda.models;
using Newtonsoft.Json;

namespace dinner_ideas_lambda.services;

public interface IDinnerItemService
{
    Task<DinnerItem> GetItem(Guid id);
    Task<IEnumerable<DinnerItem>> GetItems();
    Task<DinnerItem> CreateItem(DinnerItem item);
    Task<DinnerItem> UpdateItem(DinnerItem item);
    Task<bool> DeleteItem(DinnerItem item);
}

public class DinnerItemService : IDinnerItemService
{
    private readonly AmazonDynamoDBConfig _clientConfig;
    private readonly AmazonDynamoDBClient _dynamoDBClient;
    private readonly IDynamoObjectService _dynamoObjectService;
    private const string TABLE_NAME = "dinner-ideas-table";
    private const string ID_KEY = "id";

    public DinnerItemService(IDynamoObjectService dynamoObjectService)
    {
        _clientConfig = new AmazonDynamoDBConfig
        {
            RegionEndpoint = RegionEndpoint.USWest1,
        };
        _dynamoDBClient = new AmazonDynamoDBClient(_clientConfig);
        _dynamoObjectService = dynamoObjectService;
    }

    public async Task<DinnerItem> CreateItem(DinnerItem item)
    {
        try 
        {
            var dict = _dynamoObjectService.ToAttributeMap(item);
            var response = await _dynamoDBClient.PutItemAsync(TABLE_NAME, dict);
            
            if (response.Attributes.TryGetValue(ID_KEY, out var id))
            {
                Guid.TryParse(id.S, out var parsed);
                item.Id = parsed;

                return item;
            }
            else {
                throw new Exception($"No id in response attributes");
            }
        }
        catch (Exception ex)
        {
            Console.WriteLine($"Unable to create item, Exception: {ex}");
            throw;
        }
    }

    public Task<bool> DeleteItem(DinnerItem item)
    {
        throw new NotImplementedException();
    }

    public async Task<IEnumerable<DinnerItem>> GetItems()
    {
        var response = await _dynamoDBClient.ScanAsync(new ScanRequest
        {
            TableName = TABLE_NAME
        });

        Console.WriteLine(JsonConvert.SerializeObject(response.Items, Formatting.Indented));



        if (response.Items.Count > 0)
            return response.Items.Select(_dynamoObjectService.FromAttributeMap<DinnerItem>);

        return [];
    }

    public async Task<DinnerItem> GetItem(Guid id)
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

    public async Task<DinnerItem> UpdateItem(DinnerItem item)
    {
        throw new NotImplementedException();
    }
}