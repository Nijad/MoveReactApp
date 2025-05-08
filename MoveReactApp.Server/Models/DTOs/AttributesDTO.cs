namespace MoveReactApp.Server.Models.DTOs
{
    public class AttributesDTO
    {
        public  int StatusId { get; } = TerminalAttribute.StatusId;
        public  string? StatusDesc { get;  } = TerminalAttribute.StatusDesc;
        public  int? ProcessId { get; } = TerminalAttribute.ProcessId;
        public string? ProcessName { get; } = TerminalAttribute.ProcessName;
        public string? ErrorMessage { get; } = TerminalAttribute.ErrorMessage;
        public DateTime? StartAt { get; } = TerminalAttribute.StartAt;
        public DateTime? StopAt { get; } = TerminalAttribute.StopAt;
        public string? User { get; } = TerminalAttribute.User;
        //public string TerminalPath { get; } = TerminalAttribute.TerminalPath;
    }
}
