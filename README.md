# Dinner Ideas
A small application to help with dinner ideas, and meal prep each week

## Front end
React

---

## Back end
Lambda(s)?

### Prerequisites
- [.NET 7](https://dotnet.microsoft.com/en-us/download/dotnet/7.0)
- [AWS Lambda Test Tool](https://github.com/aws/aws-lambda-dotnet/tree/master/Tools/LambdaTestTool)

Install the .NET 7 version of the lambda test tool:

`dotnet tool install -g Amazon.Lambda.TestTool-7.0`

Build the lambda, navigate to the .csproj folder location:

`dotnet build`

And finally run the test tool (while in the above directory):

`dotnet lambda-test-tool-7.0`