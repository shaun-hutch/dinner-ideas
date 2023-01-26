using Amazon.Lambda.Core;
using Amazon.DynamoDBv2;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace DinnerIdeas;

public class Function
{
    private IAmazonDynamoDB _dbClient;
    private readonly IConfigurationRoot _configuration;
    private readonly IServiceProvider _serviceProvider;

    public Function()
    {
        _configuration = new ConfigurationBuilder()
            .AddEnvironmentVariables()
            .Build();
    }


    /// <summary>
    /// A simple function that takes a string and does a ToUpper
    /// </summary>
    /// <param name="input"></param>
    /// <param name="context"></param>
    /// <returns></returns>
    public DinnerResponse FunctionHandler(DinnerPayload payload, ILambdaContext context)
    {
        var architecture = System.Runtime.InteropServices.RuntimeInformation.ProcessArchitecture;
        var dotnetVersion = Environment.Version.ToString();

        Console.WriteLine(architecture);
        Console.WriteLine(dotnetVersion);

        // TODO test dynamo DB
        AmazonDynamoDBConfig config = new AmazonDynamoDBConfig
        {
            ServiceURL = "http://localhost:8000"
        };
        _dbClient = new AmazonDynamoDBClient(config);

        // generate some dummy data for now
        var items = Enumerable.Range(0, 10).Select(x => 
            new FoodItem {
                Id = Guid.NewGuid(),
                Description = $"test description {x}",
                ImageBase64 = "test base 64",
                Name = $"food item {x}",
                ImageUrl = "https://picsum.photos/200"
            }
        );

        switch (payload.Type) {
            case PayloadType.Read:
                return new DinnerResponse {
                    FoodItems = items
                };
            default:
                return new DinnerResponse();
        }
    }
}
