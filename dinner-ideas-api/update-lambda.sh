output=$(aws lambda update-function-code --function-name dinner-ideas-lambda-api --zip-file fileb://function.zip) 
# Check if the command was successful
if [ $? -ne 0 ]; then
    # The command failed, print the output
    echo "Error: $output"
else 
    echo "$output"
    echo "Lambda update success!"
fi