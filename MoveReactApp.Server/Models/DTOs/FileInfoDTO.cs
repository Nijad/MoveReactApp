namespace MoveReactApp.Server.Models.DTOs
{
    public class FileInfoDTO
    {
        public int Id { get; set; }
        public string Path { get; set; }
        public string Name { get; set; }
        public string Extension { get; set; }
        public long Length { get; set; }
    }
}
