using Amazon;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using Newtonsoft.Json;

namespace dinner_ideas_lambda.services;

public interface IDynamoObjectService
{
    Dictionary<string, AttributeValue> ToAttributeMap<T>(T item);

    T FromAttributeMap<T>(Dictionary<string, AttributeValue> dict) where T : class;
}

public class DynamoObjectService : IDynamoObjectService
{
    public T FromAttributeMap<T>(Dictionary<string, AttributeValue> dict) where T : class
    {
        if (dict == null || dict.Count == 0)
            return default!;

        var json = Document.FromAttributeMap(dict).ToJson();
        if (string.IsNullOrEmpty(json))
            return default!;

        Console.WriteLine($"json: {json}");

        var obj = JsonConvert.DeserializeObject<T>(json);

        return obj!;
    }

    public Dictionary<string, AttributeValue> ToAttributeMap<T>(T item)
        => Document.FromJson(JsonConvert.SerializeObject(item)).ToAttributeMap();
}
