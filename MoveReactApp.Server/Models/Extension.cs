namespace MoveReactApp.Server.Models
{
    public class Extension
    {
        public string Ext { get; set; }
        public string Program { get; set; }
        public bool Enabled { get; set; }
        public string Note { get; set; }
        public List<ExtensionDepts> Departments { get; set; }
    }
}
