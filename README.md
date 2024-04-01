# Dinner Ideas
A small application to help with dinner ideas, and meal prep each week.

### Prerequisites
- [AWS CLI V2](https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html)

Install AWS CLI, then setup your credentials accordingly with 

`aws configure`

**Note:** you will need to setup a user with appropriate permissions in IAM and generate an access key pair:
[IAM](https://us-east-1.console.aws.amazon.com/iamv2/home?region=us-west-1#/users)

Navigate to `./app/dinner-ideas` to configure and run the frontend application (local frontend also points to GraphQL backend)

Configure the Amplify CLI with required parameters (may require you to login to the AWS Console)

## Frontend
React application

- [Node.js](https://nodejs.org)

Install node JS, latest, then navigate to `./app/dinner-ideas`

Install the frontend dependencies:

`npm install`

Run the frontend:

`npm run serve`
