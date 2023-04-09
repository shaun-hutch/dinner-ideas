using System.Reflection;
using Amazon.DynamoDBv2.Model;

namespace DinnerIdeas.Services 
{
    public interface IMapper 
    {
        public T MapFromDymnamoDBObject<T>(Dictionary<string, AttributeValue> item);
        public Dictionary<string, AttributeValue> MapToDynamoDBObject<T>(T item);
    }

    public class Mapper : IMapper
    {
        public T MapFromDymnamoDBObject<T>(Dictionary<string, AttributeValue> item)
        {
            if (item == null)
                throw new NullReferenceException();
        
            T? result = (T)Activator.CreateInstance<T>();
            var resultType = typeof(T);

            var properties = resultType.GetProperties();
            foreach (var prop in properties)
            {
                if (item.ContainsKey(prop.Name)) {
                    if (prop.PropertyType == typeof(System.Guid))
                        prop.SetValue(result, Guid.Parse(item[prop.Name].S));
                    else 
                        prop.SetValue(result, item[prop.Name].S);
                }
                else {
                    Console.WriteLine($"no property found: {prop.Name}");
                }

            }

            return result;
        }

        public Dictionary<string, AttributeValue> MapToDynamoDBObject<T>(T item)
        {
            throw new NotImplementedException();
        }
    }
}