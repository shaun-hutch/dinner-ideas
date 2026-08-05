using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using System.Net;
using System.Net.Http;
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
                return CorsOk();

            // Auth routes — no JWT required
            if (path.Contains("auth/register"))
            {
                var req = Deserialize<RegisterRequest>(apiGatewayEvent.Body);
                return Ok(await Resolve<IAuthService>().Register(req!.Email, req.Password));
            }

            if (path.Contains("auth/login"))
            {
                var req = Deserialize<LoginRequest>(apiGatewayEvent.Body);
                return Ok(await Resolve<IAuthService>().Login(req!.Email, req.Password));
            }

            // Validate JWT for all other routes
            var authHeader = apiGatewayEvent.Headers?.TryGetValue("Authorization", out var h1) == true ? h1
                : apiGatewayEvent.Headers?.TryGetValue("authorization", out var h2) == true ? h2
                : null;

            if (string.IsNullOrEmpty(authHeader) || !authHeader.StartsWith("Bearer "))
                return Error(401, "Authorization required");

            var token = authHeader["Bearer ".Length..];
            var principal = Resolve<IAuthService>().ValidateToken(token);

            if (principal == null)
                return Error(401, "Invalid or expired token");

            var userIdClaim = principal.FindFirst(ClaimTypes.NameIdentifier)?.Value
                           ?? principal.FindFirst("sub")?.Value;
            var userId = int.TryParse(userIdClaim, out var parsedId) ? parsedId : 1;

            // Proceed to actual route handling
            var dinnerItemService = Resolve<IDinnerItemService>();

            // Extract a GUID id from the last path segment if present
            // (e.g., /dinner-ideas-db/550e8400-e29b-41d4-a716-446655440000).
            // Uses the raw path rather than API Gateway path parameters so the
            // Lambda works with {proxy+} greedy routing, HTTP API $default, etc.
            Guid? TryGetIdFromPath(string p)
            {
                var segments = p.Trim('/').Split('/');
                if (segments.Length >= 2 && Guid.TryParse(segments.Last(), out var parsed))
                    return parsed;
                return null;
            }
            var pathId = TryGetIdFromPath(path);

            switch (apiGatewayEvent.HttpMethod)
            {
                case "GET":
                    if (path.Contains("meals/random"))
                    {
                        context.Logger.LogInformation("Fetching random meal from TheMealDB");
                        bodyResponse = Serialize(await Resolve<IMealDbService>().GetRandomMeal());
                    }
                    else if (path.Contains("meals/search"))
                    {
                        var q = apiGatewayEvent.QueryStringParameters?.TryGetValue("q", out var query) == true ? query : "";
                        context.Logger.LogInformation($"Searching TheMealDB for: {q}");
                        bodyResponse = Serialize(await Resolve<IMealDbService>().SearchMeals(q));
                    }
                    else if (path.Contains("meals/categories"))
                    {
                        context.Logger.LogInformation("Fetching meal categories from TheMealDB");
                        bodyResponse = Serialize(await Resolve<IMealDbService>().GetCategories());
                    }
                    else if (pathId.HasValue)
                    {
                        context.Logger.LogInformation($"GET item by id: {pathId.Value}");
                        bodyResponse = Serialize(await dinnerItemService.GetItem(pathId.Value));
                    }
                    else
                    {
                        bodyResponse = Serialize(await dinnerItemService.GetItems());
                    }
                    break;

                case "POST":
                    if (path.Contains("meals/import"))
                    {
                        context.Logger.LogInformation("Importing meal from TheMealDB");
                        var importReq = Deserialize<MealImportRequest>(apiGatewayEvent.Body);
                        bodyResponse = Serialize(await Resolve<IMealDbService>().ImportMeal(importReq!.MealId, userId));
                    }
                    else if (path.Contains("seed"))
                    {
                        context.Logger.LogInformation("Seeding starter recipes");
                        var recipes = SeedData.GetSeedRecipes();
                        var created = new List<DinnerItem>();
                        foreach (var r in recipes)
                        {
                            r.CreatedBy = userId;
                            r.LastModifiedBy = userId;
                            r.CreatedDate = DateTime.UtcNow;
                            r.LastModifiedDate = DateTime.UtcNow;
                            created.Add(await dinnerItemService.CreateItem(r));
                        }
                        context.Logger.LogInformation($"Seeded {created.Count} starter recipes");
                        bodyResponse = Serialize(created);
                    }
                    else if (path.Contains("upload-url"))
                    {
                        context.Logger.LogInformation("generating upload URL");
                        var uploadReq = Deserialize<ImageUploadRequest>(apiGatewayEvent.Body);
                        var imageKey = $"images/{uploadReq!.DinnerItemId}/{Guid.NewGuid()}{Path.GetExtension(uploadReq.FileName)}";
                        var s3 = Resolve<IS3Service>();
                        bodyResponse = Serialize(new ImageUploadResponse
                        {
                            UploadUrl = s3.GenerateUploadUrl(imageKey, uploadReq.ContentType, TimeSpan.FromMinutes(5)),
                            ImageKey = imageKey,
                            ImageUrl = s3.GetImageUrl(imageKey)
                        });
                    }
                    else if (path.Contains("generate"))
                    {
                        context.Logger.LogInformation("generating random item list");
                        var genReq = Deserialize<DinnerGenerateRequest>(apiGatewayEvent.Body);
                        bodyResponse = Serialize(await dinnerItemService.GenerateItems(genReq!.Count));
                    }
                    else
                    {
                        context.Logger.LogInformation("creating item");
                        var item = Deserialize<DinnerItem>(apiGatewayEvent.Body);
                        item!.CreatedBy = userId;
                        bodyResponse = Serialize(await dinnerItemService.CreateItem(item));
                    }
                    break;

                case "PUT":
                    var updateItem = Deserialize<DinnerItem>(apiGatewayEvent.Body);
                    updateItem!.LastModifiedBy = userId;
                    bodyResponse = Serialize(await dinnerItemService.UpdateItem(updateItem));
                    break;

                case "DELETE":
                    if (pathId.HasValue)
                    {
                        context.Logger.LogInformation($"DELETE item by id: {pathId.Value}");
                        bodyResponse = Serialize(await dinnerItemService.DeleteItem(pathId.Value));
                    }
                    else
                    {
                        context.Logger.LogWarning("DELETE called without a valid GUID id in path");
                        statusCode = (int)HttpStatusCode.BadRequest;
                        bodyResponse = Serialize(new { error = "Item id is required for DELETE" });
                    }
                    break;
            }
        }
        catch (UnauthorizedAccessException ex)
        {
            Console.WriteLine(ex);
            return Error(401, ex.Message);
        }
        catch (InvalidOperationException ex)
        {
            Console.WriteLine(ex);
            return Error(409, ex.Message);
        }
        catch (Exception ex)
        {
            Console.WriteLine(ex);
            return Error(500, "An internal error occurred");
        }

        return BuildResponse(statusCode, bodyResponse);
    }

    // ── Helpers ───────────────────────────────────────────────────────────

    /// <summary>Resolve a service from the DI container.</summary>
    private T Resolve<T>() where T : notnull => provider.GetRequiredService<T>();

    /// <summary>Deserialize the request body.</summary>
    private static T? Deserialize<T>(string? body) => JsonConvert.DeserializeObject<T>(body ?? "");

    /// <summary>Serialize an object to JSON.</summary>
    private static string Serialize(object? obj) => JsonConvert.SerializeObject(obj);

    /// <summary>Return a 200 OK with JSON body.</summary>
    private static APIGatewayProxyResponse Ok(object? body) => BuildResponse(200, Serialize(body));

    /// <summary>Return a CORS preflight 200 OK.</summary>
    private static APIGatewayProxyResponse CorsOk() => new() { StatusCode = 200, Headers = CorsHeaders() };

    /// <summary>Return an error response.</summary>
    private static APIGatewayProxyResponse Error(int code, string message) =>
        BuildResponse(code, Serialize(new { error = message }));

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
        services.AddSingleton<HttpClient>();
        services.AddScoped<IMealDbService, MealDbService>();

        JsonConvert.DefaultSettings = () => new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }
}
