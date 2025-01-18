using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Net;
using Newtonsoft.Json;
using Microsoft.Extensions.DependencyInjection;
using dinner_ideas_lambda.services;
using dinner_ideas_lambda.models;
using Newtonsoft.Json.Serialization;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace dinner_ideas_lambda;

public class Function
{
    private ServiceProvider provider;

    public Function()
    {
        var services = new ServiceCollection();
        ConfigureServices(services);
        provider = services.BuildServiceProvider();
    }

    public async Task<APIGatewayProxyResponse> FunctionHandler(APIGatewayProxyRequest apiGatewayEvent, ILambdaContext context)
    {
        var dinnerItemService = provider.GetRequiredService<IDinnerItemService>();
        var routeParams = apiGatewayEvent.PathParameters;
        var path = apiGatewayEvent.Path;
        var bodyResponse = "";
        var statusCode = (int)HttpStatusCode.OK;
        
        try 
        {
            switch (apiGatewayEvent.HttpMethod)
            {
                case "GET":
                    if (routeParams?.TryGetValue("id", out var id) == true)
                    {
                        context.Logger.LogInformation($"contains id: {id}");
                        if (Guid.TryParse(id, out var parsed))
                        {
                            var itemResponse = await dinnerItemService.GetItem(parsed);
                            bodyResponse = JsonConvert.SerializeObject(itemResponse);
                        }
                        else
                            context.Logger.LogWarning($"{id} not a valid guid");
                    }
                    else 
                    {
                        var itemListResponse = await dinnerItemService.GetItems();
                        bodyResponse = JsonConvert.SerializeObject(itemListResponse);
                    }
                    break;
                case "POST":
                    if (path == "/generate")
                    {
                        var generateRequest = JsonConvert.DeserializeObject<DinnerGenerateRequest>(apiGatewayEvent.Body);
                        var generatedItems = await dinnerItemService.GenerateItems(generateRequest.Count);
                        bodyResponse = JsonConvert.SerializeObject(generatedItems);
                    }
                    else
                    {
                        var createItem = JsonConvert.DeserializeObject<DinnerItem>(apiGatewayEvent.Body);
                        var postResponse = await dinnerItemService.CreateItem(createItem!);
                        bodyResponse = JsonConvert.SerializeObject(postResponse);
                    }
                    break;
                case "PUT":
                    var updateItem = JsonConvert.DeserializeObject<DinnerItem>(apiGatewayEvent.Body);

                    var putResponse = await dinnerItemService.UpdateItem(updateItem!);

                    bodyResponse = JsonConvert.SerializeObject(putResponse);
                    break;
                case "DELETE":
                    if (routeParams?.TryGetValue("id", out var deleteId) == true)
                    {
                        context.Logger.LogInformation($"contains id for deletion: {deleteId}");
                        if (Guid.TryParse(deleteId, out var parsed))
                        {
                            var deleted = await dinnerItemService.DeleteItem(parsed);
                            bodyResponse = JsonConvert.SerializeObject(deleted);
                        }
                        else
                            context.Logger.LogWarning($"{deleteId} not a valid guid");
                    }
                    break;
            }
        }

        catch (Exception ex)
        {
            Console.WriteLine(ex);
            statusCode = (int)HttpStatusCode.InternalServerError;
        }

        return new APIGatewayProxyResponse
        {
            StatusCode = statusCode,
            Body = bodyResponse,
            Headers = new Dictionary<string, string>
            {
                { "Content-Type", "application/json" },
                { "Access-Control-Allow-Origin", "*" }, // Allow all origins
                { "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE" }, // Allow specific methods
                { "Access-Control-Allow-Headers", "Content-Type, Authorization" } // Allow specific headers
            }
        };
    }

    private void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IDinnerItemService, DinnerItemService>();
        services.AddScoped<IDynamoObjectService, DynamoObjectService>();
        services.AddScoped<IDatabaseClientService, DatabaseClientService>();

        JsonConvert.DefaultSettings = () => new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
        
    }
}