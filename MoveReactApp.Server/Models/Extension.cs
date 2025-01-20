using Newtonsoft.Json;
using System.ComponentModel.DataAnnotations;

namespace MoveReactApp.Server.Models
{
    public class Extension
    {
        public int Id { get; set; }
        [JsonProperty("Extension")]
        [MaxLength(105)]
        public string Ext { get; set; }
        public string Program { get; set; }
        public bool Enabled { get; set; }
        public string Note { get; set; }
    }
}
