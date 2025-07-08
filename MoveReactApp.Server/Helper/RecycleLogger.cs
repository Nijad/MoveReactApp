using System.Diagnostics;

namespace MoveReactApp.Server.Helper
{
    public class RecycleLogger
    {
        private static readonly object Lock = new object();
        private const string path = @"C:\logs";
        private const string LogPath = path + @"\recycle_{0:yyyy-MM}.log";

        public void Log(string message)
        {
            if(!Directory.Exists(path)) 
                Directory.CreateDirectory(path);
            lock (Lock)
            {
                try
                {
                    string reason = Environment.GetEnvironmentVariable("APP_POOL_RECYCLE_REASON") ?? "Unknown";
                    string entry = $"{DateTime.UtcNow:o} | " +
                                   $"PID:{Process.GetCurrentProcess().Id} | " +
                                   $"Reason:{reason} | {message}";

                    File.AppendAllText(
                        string.Format(LogPath, DateTime.Now),
                        entry + Environment.NewLine);
                }
                catch (Exception ex)
                {
                    EventLog.WriteEntry("Application",
                        $"Recycle Log Error: {ex.Message}",
                        EventLogEntryType.Error);
                }
            }
        }
    }
}
