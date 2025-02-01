namespace MoveReactApp.Server.Models
{
    public class Department
    {
        public string Dept { get; set; }
        public string LocalPath { get; set; }
        public string NetPath { get; set; }
        public bool Enabled { get; set; }
        public string Note { get; set; }
        public List<ExtensionDepts> Extensions { get; set; }
        public List<ExtensionDepts> RemainExtensions { get; set; }
    }
}
