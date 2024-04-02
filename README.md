# Dinner Ideas
A small application to help with dinner ideas, and meal prep each week.

[![Node.js CI](https://github.com/shaun-hutch/dinner-ideas/actions/workflows/action.yaml/badge.svg)](https://github.com/shaun-hutch/dinner-ideas/actions/workflows/action.yaml)

### Prerequisites
- [AWS CLI V2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Install AWS CLI, then setup your credentials accordingly with 

`aws configure`

**Note:** you will need to setup a user with appropriate permissions in IAM and generate an access key pair:
[IAM](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-west-1#/users)

Navigate to `./app/dinner-ideas` to configure and run the frontend application.

## Frontend
React application

- [Node.js](https://nodejs.org)

Install node JS, latest, then navigate to `./app/dinner-ideas`

Install the frontend dependencies:

`npm install`

Run the frontend:

`npm run serve`

## Backend

Coming Soon™

# CI/CD

GitHub Action to build and deploy to S3, accessed through CloudFront.
