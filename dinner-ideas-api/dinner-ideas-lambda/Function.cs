using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Net;
using Newtonsoft.Json;

// Assembly attribute to enable the Lambda function's JSON input to be converted into a .NET class.
[assembly: LambdaSerializer(typeof(Amazon.Lambda.Serialization.SystemTextJson.DefaultLambdaJsonSerializer))]

namespace dinner_ideas_lambda;

public class Function
{
    public APIGatewayProxyResponse FunctionHandler(APIGatewayProxyRequest apiGatewayEvent, ILambdaContext context)
    {

        var json = JsonConvert.SerializeObject(apiGatewayEvent, Formatting.Indented);

        context.Logger.LogInformation(json);


        var routeParams = apiGatewayEvent.PathParameters;

        context.Logger.LogInformation($"HTTP Method: {apiGatewayEvent.HttpMethod}");
        
        switch (apiGatewayEvent.HttpMethod)
        {
            case "GET":
                if (routeParams.TryGetValue("id", out var id))
                {
                    context.Logger.LogInformation($"contains id: {id}");
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
            Body = json
        };
    }

    
}