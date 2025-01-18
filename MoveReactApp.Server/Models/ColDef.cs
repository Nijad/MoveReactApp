using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;
using System.Reflection;

namespace MoveReactApp.Server.Models
{
    public static class ColDef
    {
        //public List<Prop> Properties { get; set; }
        public static List<Prop> Properties<T>(object o) where T : class
        {
            List<Prop> properties = new();
            PropertyInfo[] propertyInfos = typeof(T).GetProperties();
            properties = new List<Prop>();

            foreach (PropertyInfo property in propertyInfos)
            {
                JsonPropertyAttribute? jsonProperty = property.GetCustomAttribute<JsonPropertyAttribute>();
                string? jsonPropertyName = jsonProperty?.PropertyName;
                Prop prop = new();
                prop.Name = jsonPropertyName != null ? jsonPropertyName : property.Name;
                prop.Type = property.PropertyType.Name;
                var c = o.GetAttributeFrom<MaxLengthAttribute>(property.Name);
                prop.Length = c != null ? c.Length : null;
                properties.Add(prop);
            }
            return properties;
        }

        private static T GetAttributeFrom<T>(this object instance, string propertyName) where T : Attribute
        {
            var attrType = typeof(T);
            var property = instance.GetType().GetProperty(propertyName);
            return (T)property.GetCustomAttributes(attrType, false).FirstOrDefault();
        }
    }
    public class Prop
    {
        public string Name { get; set; }
        public string Type { get; set; }
        public int? Length { get; set; }
    }
}
