using Amazon.Lambda.APIGatewayEvents;
using dinner_ideas_lambda;
using dinner_ideas_lambda.models;
using Newtonsoft.Json;

namespace dinner_ideas_lambda_tester;
public class Program
{
    public static async Task Main(string[] args)
    {
        var function = new Function();

        var foodItem = new DinnerItem
        {
            CookTime = 20,
            CreatedBy = 1,
            CreatedDate = DateTime.Now,
            Description = "test",
            Id = Guid.NewGuid(),
            LastModifiedBy = 1,
            LastModifiedDate = DateTime.Now,
            Name = "Soup",
            PrepTime = 20,
            Version = 1,
            Steps = new Dictionary<string, string> {},
            Tags = new [] { FoodTag.Cheap }
        };


        var e = new APIGatewayProxyRequest
        {
            Body = JsonConvert.SerializeObject(foodItem),
            HttpMethod = "POST",
            PathParameters = new Dictionary<string, string> { },
            
        };

        var response = await function.FunctionHandler(e, null);

        Console.WriteLine(response);
    }
}