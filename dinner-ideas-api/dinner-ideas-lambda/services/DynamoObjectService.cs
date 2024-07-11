using Amazon;
using Amazon.DynamoDBv2.DocumentModel;
using Amazon.DynamoDBv2.Model;
using dinner_ideas_lambda.models;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace dinner_ideas_lambda.services;

public interface IDynamoObjectService
{
    Dictionary<string, AttributeValue> ToAttributeMap<T>(T item) where T: BaseItem;

    T FromAttributeMap<T>(Dictionary<string, AttributeValue> dict) where T : BaseItem;

    string CreateIdKey<T>(Guid id) where T : BaseItem;
}

public class DynamoObjectService : IDynamoObjectService
{
    private readonly JsonSerializerSettings _settings;

    public DynamoObjectService()
    {
        _settings = new JsonSerializerSettings
        {
            ContractResolver = new CamelCasePropertyNamesContractResolver()
        };
    }

    public T FromAttributeMap<T>(Dictionary<string, AttributeValue> dict) where T : BaseItem
    {
        Console.WriteLine($"{dict.Keys.Count} the dict key count");
        if (dict == null || dict.Count == 0)
            return default!;

        var json = Document.FromAttributeMap(dict).ToJson();
        Console.WriteLine($"json: {json}");
        if (string.IsNullOrEmpty(json))
            return default!;


        var obj = JsonConvert.DeserializeObject<T>(json);

        return obj!;
    }

    public Dictionary<string, AttributeValue> ToAttributeMap<T>(T item) where T : BaseItem
        => Document.FromJson(JsonConvert.SerializeObject(item, _settings)).ToAttributeMap();

    public string CreateIdKey<T>(Guid id) where T : BaseItem
        => $"{typeof(T).Name}|{id}";
}
