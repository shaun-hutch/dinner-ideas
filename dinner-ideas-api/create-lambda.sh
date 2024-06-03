aws lambda create-function \
--function-name dinner-ideas-lambda-api \
--zip-file fileb://function.zip \
--handler dinner-ideas-lambda-api.lambda_handler \
--runtime python3.12 \
--role arn:aws:iam::896789984538:role/dinner-ideas-lambda-apigateway-role