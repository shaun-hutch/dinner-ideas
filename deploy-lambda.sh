echo checking OS...
if [[ $OSTYPE != *'darwin'* ]]; then
    apt-get install -y dotnet-sdk-7.0
fi
echo bundling lambda...
dotnet lambda deploy-function -fn dinner-ideas -pl api/src/dinner-ideas
echo lambda deployed!