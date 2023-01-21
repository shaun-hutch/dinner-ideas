# Dinner Ideas
A small application to help with dinner ideas, and meal prep each week.

## Front end
React application

- [Node.js](https://nodejs.org)

Install node JS, latest, then navigate to `frontend/dinner-ideas`

`npm install`

`npm run start`

---

## Back end

### Prerequisites
- [.NET 6](https://dotnet.microsoft.com/en-us/download/dotnet/6.0)
- [AWS Lambda Test Tool](https://github.com/aws/aws-lambda-dotnet/tree/master/Tools/LambdaTestTool)
- [AWS CLI V2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Install AWS CLI, then setup your credentials accordingly with `aws configure`

**Note:** you will need to setup a user with appropriate permissions in IAM and generate an access key pair:

[IAM](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-west-1#/users)

Install the .NET 6 version of the lambda test tool:

`dotnet tool install -g Amazon.Lambda.TestTool-6.0`


In the root repo folder, run the shell command to build and run the lambda test tool:

`./run-local.sh`

The commands used:
`dotnet build`
`dotnet lambda-test-tool-6.0`

To deploy the lambda to AWS, run this shell file:

`./deploy-lambda.sh`