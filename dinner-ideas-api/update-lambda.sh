#!/bin/bash

# Define paths
BUILD_DIR="./dinner-ideas-lambda/bin/Release/net8.0/linux-arm64/publish"
ZIP_FILE="./dinner-ideas-lambda/bin/Release/net8.0/linux-arm64/function.zip"

# Step 1: Build and zip the Lambda function
echo "Building the Lambda function..."
dotnet publish ./dinner-ideas-lambda --runtime linux-arm64 -c Release

# Check if dotnet publish was successful
if [ $? -ne 0 ]; then
    echo "Error during dotnet publish!"
    exit 1
fi

# Step 2: Debug: Check if the build directory exists and list contents
echo "Checking if the publish directory exists..."
if [ -d "$BUILD_DIR" ]; then
    echo "Publish directory exists: $BUILD_DIR"
    echo "Contents of publish directory:"
    ls -l "$BUILD_DIR"
else
    echo "Error: Publish directory does not exist!"
    exit 1
fi

# Step 3: Ensure the directory exists for the zip file
echo "Ensuring the zip directory exists..."
mkdir -p "$(dirname "$ZIP_FILE")"

# Step 4: Create the zip file
echo "Zipping the Lambda function..."
zip -r "$ZIP_FILE" "$BUILD_DIR"/*

# Check if zip was successful
if [ $? -ne 0 ]; then
    echo "Error creating the zip file!"
    exit 1
fi

# Step 5: Deploy to AWS Lambda
echo "Deploying to AWS Lambda..."
output=$(aws lambda update-function-code --function-name dinner-ideas-lambda-api --zip-file fileb://"$ZIP_FILE")

# Check if the command was successful
if [ $? -ne 0 ]; then
    echo "Error during deployment: $output"
    exit 1
else
    echo "$output"
    echo "Lambda update success!"
fi