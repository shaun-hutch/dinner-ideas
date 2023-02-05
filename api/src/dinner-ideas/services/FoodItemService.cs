using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;

namespace DinnerIdeas.Services
{
    public interface IFoodItemService
    {
        Task<FoodItem> GetItem(Guid guid);
        Task<List<FoodItem>> GetItems(Guid weekItemGuid);
        Task UpsertItem(FoodItem item);
        Task DeleteItem(Guid guid);
    }

    public class FoodItemService : IFoodItemService
    {
        private const string TableName = "dinner-ideas";
        private readonly IAmazonDynamoDB _dbClient;
        private readonly IMapper _mapper;
        public FoodItemService(IAmazonDynamoDB dbClient, IMapper mapper)
        {
            _dbClient = dbClient;
            _mapper = mapper;
        }

        public async Task DeleteItem(Guid guid)
        {
            throw new NotImplementedException();
        }

        public async Task<FoodItem> GetItem(Guid guid)
        {
            var request = new GetItemRequest
            {
                TableName = TableName,
                Key = new Dictionary<string, AttributeValue>() { { "dinner-ideas", new AttributeValue { S = $"FoodItem|{guid}" } } }
            };

            var response = await _dbClient.GetItemAsync(request);

            if (response?.Item == null) 
                throw new NullReferenceException("no food item obtained, null");

            if (response?.Item.Count == 0)
            {
                Console.WriteLine($"unable to find food item with id: {guid}");
                throw new ResourceNotFoundException("no food item found, empty");
            }

            return _mapper.MapFromDymnamoDBObject<FoodItem>(response.Item);
        }

        public async Task<List<FoodItem>> GetItems(Guid weekItemGuid)
        {
            throw new NotImplementedException();
        }

        public async Task UpsertItem(FoodItem item)
        {
            throw new NotImplementedException();
        }
    }
}
