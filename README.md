# Dinner Ideas
A small application to help with dinner ideas, and meal prep each week.

[![Node.js CI](https://github.com/shaun-hutch/dinner-ideas/actions/workflows/action.yaml/badge.svg)](https://github.com/shaun-hutch/dinner-ideas/actions/workflows/action.yaml)

### Prerequisites
- [AWS CLI V2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)
- [Node.js current LTS](https://nodejs.org/en)
- [.NET 8 SDK](https://dotnet.microsoft.com/en-us/download/dotnet/8.0)

Install AWS CLI, then setup your credentials accordingly with 

`aws configure`

**Note:** you will need to setup a user with appropriate permissions in IAM and generate an access key pair:
[IAM](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-west-1#/users)

Navigate to `./dinner-ideas` to configure and run the frontend application.

## Frontend
A React application hosted on S3 as a single page application, accessible through AWS Cloudfront. 

Install the frontend dependencies:

`npm install`

Run the frontend:

`npm run serve`

## Backend

An AWS Lambda deployed, accessible with an API Gateway REST API. Database is DynamoDB.

Initial dev steps:
- `dotnet restore`
- `dotnet build`

To run locally, the `dinner-ideas-lambda-tester.csproj` project can be used to manually invoke the function code (note you still need AWS CLI and credentials setup for the database calls).

Navigate to `./dinner-ideas-api` to build, zip and deploy a Lambda to AWS (these are used in the Github action build and deploy).
- Build and zip: `./zip.sh`
- Deploy: First deployment: `./create-lambda.sh`, update: `./update-lambda.sh` 

# CI/CD

GitHub Action to build and deploy to S3, accessed through CloudFront.
