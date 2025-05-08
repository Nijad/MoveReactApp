using System.Diagnostics;

namespace MoveReactApp.Server.Models
{
    public static class TerminalAttribute
    {
        public static int StatusId { get; set; }
        public static string? StatusDesc { get; set; }
        public static int? ProcessId { get; set; }
        public static string? ProcessName { get; set; }
        public static string? ErrorMessage { get; set; }
        public static DateTime? StartAt { get; set; }
        public static DateTime? StopAt { get; set; }
        public static string? User { get; set; }
        public static string TerminalPath { get; set; }

        public static bool RunTerminal(string username)
        {
            //get attributes
            bool isStart = false;
            using (Process pProcess = new Process())
            {
                //TerminalPath = @"C:\Users\khourynj\source\repos\ConsoleApp4\ConsoleApp4\bin\Debug\net8.0\ConsoleApp4.exe";
                //TerminalPath = @"C:\Users\khourynj\source\repos\Move7\Move7\bin\Debug\net8.0\Move7.exe";
                pProcess.StartInfo.FileName = TerminalPath;
                pProcess.StartInfo.Arguments = $"RunFromApp {username}"; //argument
                pProcess.StartInfo.UseShellExecute = true;
                pProcess.StartInfo.CreateNoWindow = false;
                pProcess.StartInfo.WindowStyle = ProcessWindowStyle.Normal;
                isStart = pProcess.Start();
                ProcessId = pProcess.Id;
                ProcessName = pProcess.ProcessName;
            }
            return isStart;
        }

        internal static bool AnyProcessWithName()
        {
            if(ProcessName == null)
                return false;
            return Process.GetProcessesByName(ProcessName).Any();
        }

        internal static bool Responding()
        {
            if (ProcessId == null)
                return true;
            return Process.GetProcessById((int)ProcessId).Responding;
        }

        internal static void TerminateTerminal()
        {
            if (ProcessName == null)
                return;
            Process[] processes = Process.GetProcessesByName(ProcessName);
            foreach (Process process in processes)
            {
                process.Kill();
                process.WaitForExit();
            }
            ProcessId = null;
        }
    }
}
