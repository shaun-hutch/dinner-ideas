using Xunit;
using Amazon.Lambda.APIGatewayEvents;
using Amazon.Lambda.TestUtilities;

namespace dinner_ideas_lambda.Tests;

public class FunctionTest
{
    [Fact]
    public async Task TestOptionsPreflightReturns200()
    {
        var request = new APIGatewayProxyRequest
        {
            HttpMethod = "OPTIONS",
            Path = "/dinner-ideas-db",
            PathParameters = new Dictionary<string, string>(),
            QueryStringParameters = new Dictionary<string, string>(),
            Headers = new Dictionary<string, string>(),
            Body = null
        };

        var context = new TestLambdaContext();
        var function = new Function();

        var response = await function.FunctionHandler(request, context);

        Assert.Equal(200, response.StatusCode);
        Assert.Contains("Access-Control-Allow-Origin", response.Headers.Keys);
    }

    [Fact]
    public async Task TestUnauthenticatedGetReturns401()
    {
        var request = new APIGatewayProxyRequest
        {
            HttpMethod = "GET",
            Path = "/dinner-ideas-db",
            PathParameters = new Dictionary<string, string>(),
            QueryStringParameters = new Dictionary<string, string>(),
            Headers = new Dictionary<string, string>(),
            Body = null
        };

        var context = new TestLambdaContext();
        var function = new Function();

        var response = await function.FunctionHandler(request, context);

        Assert.Equal(401, response.StatusCode);
    }
}