using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Net;
using Newtonsoft.Json;
using Microsoft.Extensions.DependencyInjection;
using dinner_ideas_lambda.services;
using dinner_ideas_lambda.models;

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

    public APIGatewayProxyResponse FunctionHandler(APIGatewayProxyRequest apiGatewayEvent, ILambdaContext context)
    {
        var dinnerItemService = provider.GetRequiredService<IDinnerItemService>();

        var json = JsonConvert.SerializeObject(apiGatewayEvent, Formatting.Indented);

        context.Logger.LogInformation(json);


        var routeParams = apiGatewayEvent.PathParameters;

        context.Logger.LogInformation($"HTTP Method: {apiGatewayEvent.HttpMethod}");
        
        var bodyResponse = "";
        switch (apiGatewayEvent.HttpMethod)
        {
            case "GET":
                if (routeParams.TryGetValue("id", out var id))
                {
                    context.Logger.LogInformation($"contains id: {id}");
                    if (Guid.TryParse(id, out var parsed))
                    {
                        var itemResponse = dinnerItemService.GetItem(parsed);
                        bodyResponse = JsonConvert.SerializeObject(itemResponse);
                    }
                    else 
                        context.Logger.LogWarning($"{id} not a valid guid");
                }
                else 
                {
                    var itemListResponse = dinnerItemService.GetItems();
                    bodyResponse = JsonConvert.SerializeObject(itemListResponse);

                }
                break;
            case "POST":
                break;
            case "PUT":
                break;
            case "DELETE":
                break;
        }

        return new APIGatewayProxyResponse
        {
            StatusCode = (int)HttpStatusCode.OK,
            Body = bodyResponse
        };
    }

    private void ConfigureServices(IServiceCollection services)
    {
        services.AddTransient<IDinnerItemService, DinnerItemService>();
    }

    
}