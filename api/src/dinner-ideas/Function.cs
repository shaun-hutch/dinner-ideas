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
    public string FunctionHandler(DinnerPayload payload, ILambdaContext context)
    {
        // TODO test dynamo DB
        AmazonDynamoDBConfig config = new AmazonDynamoDBConfig
        {
            ServiceURL = "http://localhost:8000"
        };
        _dbClient = new AmazonDynamoDBClient(config);

        // _dbClient.CreateTableAsync


        return payload.Type switch {
            PayloadType.Create => "Create", 
            PayloadType.Read => "Read", 
            PayloadType.Update => "Update", 
            PayloadType.Delete => "Delete", 
            _ => "Invalid"
        };
    }
}
