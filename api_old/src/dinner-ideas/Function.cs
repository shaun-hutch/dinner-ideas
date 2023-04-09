using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using DinnerIdeas.Services;
using Amazon;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace DinnerIdeas;

public class Function
{
    private IAmazonDynamoDB _dbClient;
    private IMapper _mapper;
    private readonly IConfigurationRoot _configuration;
    private readonly IServiceProvider _serviceProvider;

    public Function()
    {
        _configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();

        var services = new ServiceCollection();
        services.AddSingleton<IServiceProvider>(sp => sp);
        services.AddScoped(typeof(IMapper), typeof(Mapper));
        _serviceProvider = services.BuildServiceProvider();

// #if DEBUG
//         AmazonDynamoDBConfig config = new AmazonDynamoDBConfig
//         {
//             ServiceURL = "http://localhost:8000"
//         };
// #elif RELEASE
        AmazonDynamoDBConfig config = new AmazonDynamoDBConfig();
        config.RegionEndpoint = RegionEndpoint.USWest1;

// #endif
        
        _dbClient = new AmazonDynamoDBClient(config);
    }


    /// <summary>
    /// A function that does CRUD operations for food and week items
    /// </summary>
    /// <param name="context"></param>
    /// <param name="payload"></param>
    /// <returns></returns>
    public async Task<DinnerResponse> FunctionHandler(DinnerPayload payload, ILambdaContext context)
    {
        using var scope = _serviceProvider.CreateScope();
        var mapper = scope.ServiceProvider.GetRequiredService<IMapper>();
        var foodItemService = new FoodItemService(_dbClient, mapper);

        Console.WriteLine($"payload food item id: {payload.FoodItemId}");
        Console.WriteLine($"payload action: {payload.Type}");

        switch (payload.Type) {
            case PayloadType.Read:
                var foodItem = await foodItemService.GetItem(payload.FoodItemId);
                return new DinnerResponse {
                    FoodItems = new List<FoodItem> { foodItem }
                };
            default:
                return new DinnerResponse();
        }
    }
}
