aws lambda invoke \
--function-name dinner-ideas-lambda-api \
--payload file://input.json outputfile.json \
--cli-binary-format raw-in-base64-out