using Xunit;
using Amazon.Lambda.Core;
using Amazon.Lambda.TestUtilities;
using DinnerIdeas;

namespace dinner_ideas.Tests;

public class FunctionTest
{
    [Fact]
    public void TestToUpperFunction()
    {

        // Invoke the lambda function and confirm the string was upper cased.
        var function = new Function();
        var context = new TestLambdaContext();
    }
}
