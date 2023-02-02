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
            T? result = (T)Activator.CreateInstance<T>();
            var resultType = typeof(T);

            var properties = resultType.GetProperties();
            foreach (var prop in properties)
            {
                Console.WriteLine(prop.Name);
                if (item.ContainsKey(prop.Name)) {
                    Console.WriteLine("setting value");
                    if (prop.PropertyType == typeof(System.Guid))

                        prop.SetValue(result, Guid.Parse(item[prop.Name].S));
                    else 
                        prop.SetValue(result, item[prop.Name].S);
                }
                else {
                    Console.WriteLine("ayy lmao nope");
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