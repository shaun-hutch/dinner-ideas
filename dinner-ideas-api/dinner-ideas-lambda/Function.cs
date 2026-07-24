using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Net;
using Newtonsoft.Json;
using Microsoft.Extensions.DependencyInjection;
using dinner_ideas_lambda.services;
using dinner_ideas_lambda.models;
using Newtonsoft.Json.Serialization;
using System.Security.Claims;

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
        var path = apiGatewayEvent.Path;
        var bodyResponse = "";
        var statusCode = (int)HttpStatusCode.OK;

        try
        {
            // Handle CORS preflight
            if (apiGatewayEvent.HttpMethod == "OPTIONS")
            {
                return new APIGatewayProxyResponse
                {
                    StatusCode = 200,
                    Headers = CorsHeaders()
                };
            }

            // Auth routes — no JWT required
            if (path.Contains("auth/register"))
            {
                var authService = provider.GetRequiredService<IAuthService>();
                var registerRequest = JsonConvert.DeserializeObject<RegisterRequest>(apiGatewayEvent.Body);
                var authResponse = await authService.Register(registerRequest!.Email, registerRequest.Password);
                bodyResponse = JsonConvert.SerializeObject(authResponse);
                return BuildResponse(statusCode, bodyResponse);
            }

            if (path.Contains("auth/login"))
            {
                var authService = provider.GetRequiredService<IAuthService>();
                var loginRequest = JsonConvert.DeserializeObject<LoginRequest>(apiGatewayEvent.Body);
                var authResponse = await authService.Login(loginRequest!.Email, loginRequest.Password);
                bodyResponse = JsonConvert.SerializeObject(authResponse);
                return BuildResponse(statusCode, bodyResponse);
            }

            // Validate JWT for all other routes
            var authHeader = apiGatewayEvent.Headers?.ContainsKey("Authorization") == true
                ? apiGatewayEvent.Headers["Authorization"]
                : apiGatewayEvent.Headers?.ContainsKey("authorization") == true
                    ? apiGatewayEvent.Headers["authorization"]
                    : null;

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
            {
                return BuildResponse(401, JsonConvert.SerializeObject(new { error = "Authorization required" }));
            }

            var token = authHeader["Bearer ".Length..];
            var authSvc = provider.GetRequiredService<IAuthService>();
            var principal = authSvc.ValidateToken(token);

            if (principal == null)
            {
                return BuildResponse(401, JsonConvert.SerializeObject(new { error = "Invalid or expired token" }));
            }

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? principal.FindFirst("sub")?.Value;
            var userId = int.TryParse(userIdClaim, out var parsedId) ? parsedId : 1;

            // Proceed to actual route handling
            var dinnerItemService = provider.GetRequiredService<IDinnerItemService>();
            var routeParams = apiGatewayEvent.PathParameters;

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
                    if (path.Contains("upload-url"))
                    {
                        context.Logger.LogInformation($"generating upload URL");
                        var uploadRequest = JsonConvert.DeserializeObject<ImageUploadRequest>(apiGatewayEvent.Body);
                        var imageKey = $"images/{uploadRequest!.DinnerItemId}/{Guid.NewGuid()}{Path.GetExtension(uploadRequest.FileName)}";
                        var s3Service = provider.GetRequiredService<IS3Service>();
                        var uploadUrl = s3Service.GenerateUploadUrl(imageKey, uploadRequest.ContentType, TimeSpan.FromMinutes(5));
                        var imageUrl = s3Service.GetImageUrl(imageKey);
                        bodyResponse = JsonConvert.SerializeObject(new ImageUploadResponse
                        {
                            UploadUrl = uploadUrl,
                            ImageKey = imageKey,
                            ImageUrl = imageUrl
                        });
                    }
                    else if (path.Contains("generate"))
                    {
                        context.Logger.LogInformation($"generating random item list");
                        var generateRequest = JsonConvert.DeserializeObject<DinnerGenerateRequest>(apiGatewayEvent.Body);
                        var generatedItems = await dinnerItemService.GenerateItems(generateRequest!.Count);
                        bodyResponse = JsonConvert.SerializeObject(generatedItems);
                    }
                    else
                    {
                        context.Logger.LogInformation($"creating item");
                        var createItem = JsonConvert.DeserializeObject<DinnerItem>(apiGatewayEvent.Body);
                        createItem!.CreatedBy = userId;
                        var postResponse = await dinnerItemService.CreateItem(createItem!);
                        bodyResponse = JsonConvert.SerializeObject(postResponse);
                    }
                    break;
                case "PUT":
                    var updateItem = JsonConvert.DeserializeObject<DinnerItem>(apiGatewayEvent.Body);
                    updateItem!.LastModifiedBy = userId;
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
        catch (UnauthorizedAccessException ex)
        {
            Console.WriteLine(ex);
            statusCode = 401;
            bodyResponse = JsonConvert.SerializeObject(new { error = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine(ex);
            statusCode = 409;
            bodyResponse = JsonConvert.SerializeObject(new { error = ex.Message });
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            statusCode = (int)HttpStatusCode.InternalServerError;
            bodyResponse = JsonConvert.SerializeObject(new { error = "An internal error occurred" });
        }

        return BuildResponse(statusCode, bodyResponse);
    }

    private static APIGatewayProxyResponse BuildResponse(int statusCode, string body)
    {
        return new APIGatewayProxyResponse
        {
            StatusCode = statusCode,
            Body = body,
            Headers = CorsHeaders()
        };
    }

    private static Dictionary<string, string> CorsHeaders()
    {
        return new Dictionary<string, string>
        {
            { "Content-Type", "application/json" },
            { "Access-Control-Allow-Origin", "*" },
            { "Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS" },
            { "Access-Control-Allow-Headers", "Content-Type, Authorization" }
        };
    }

    private void ConfigureServices(IServiceCollection services)
    {
        services.AddScoped<IDinnerItemService, DinnerItemService>();
        services.AddScoped<IDynamoObjectService, DynamoObjectService>();
        services.AddScoped<IDatabaseClientService, DatabaseClientService>();
        services.AddSingleton<IS3Service, S3Service>();
        services.AddScoped<IAuthService, AuthService>();

        JsonConvert.DefaultSettings = () => new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }
}
