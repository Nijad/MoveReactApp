namespace MoveReactApp.Server.Models.DTOs
{
    public class DirectoriesDTO
    {
        public string Name { get; set; }
        public bool IsOpen { get; set; }
        public bool CanMove { get; set; }
        public string Directory { get; set; }
        public string DisplayDirectory { get; set; }
        public string Destination { get; set; }
        public List<DirectoriesDTO> Children { get; set; }
    }
}