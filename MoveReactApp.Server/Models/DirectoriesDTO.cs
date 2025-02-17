namespace MoveReactApp.Server.Models
{
    public class DirectoriesDTO
    {
        public string Name { get; set; }
        public bool IsOpen { get; set; }
        public string Directory { get; set; }
        public List<DirectoriesDTO> Children { get; set; }
    }
}
