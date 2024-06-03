dotnet publish ./dinner-ideas-lambda --runtime linux-arm64
cd dinner-ideas-lambda/bin/Release/net8.0/linux-arm64
zip -r ../../../../../function.zip .