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
            T? result = default(T);
            var resultType = typeof(T);

            var properties = resultType.GetProperties();
            foreach (var prop in properties)
            {
                prop.SetValue(result, item[prop.Name].S);
            }

            return result;
        }

        public Dictionary<string, AttributeValue> MapToDynamoDBObject<T>(T item)
        {
            throw new NotImplementedException();
        }
    }
}