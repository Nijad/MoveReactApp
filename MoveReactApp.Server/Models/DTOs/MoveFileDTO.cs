namespace MoveReactApp.Server.Models.DTOs
{
    public class MoveFileDTO
    {
        public string File { get; set; }
        public string Destination { get; set; }
        public string Reason { get; set; }
        public string Dept
        {
            get
            {
                string[] s = Destination.Split('\\', StringSplitOptions.RemoveEmptyEntries);
                if (s.Length > 2)
                    return s[s.Length - 3];
                return "";
            }
        }
        public string Dest
        {
            get
            {
                string[] s = Destination.Split('\\', StringSplitOptions.RemoveEmptyEntries);
                if (s.Length > 2)
                    return s[s.Length - 2];
                return "";
            }
        }
    }
}
