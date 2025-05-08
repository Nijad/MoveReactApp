namespace MoveReactApp.Server.Helper
{
    public enum TableEnum
    {
        Configurations,
        Extension,
        Department,
        DepartmentExtensions,
        Terminal
    }

    public enum ActionEnum
    {
        Add,
        Update,
        Delete
    }

    public enum TerminalStatusEnum
    {
        closed,
        running,
        stopped
    }
    public static class EnumHelper
    {
        public static string GetTableName(TableEnum table)
        {
            switch (table)
            {
                case TableEnum.Configurations:
                    return "config";
                case TableEnum.Extension:
                    return "extension";
                case TableEnum.Department:
                    return "department";
                case TableEnum.DepartmentExtensions:
                    return "dept_ext";
                case TableEnum.Terminal:
                    return "terminal_attribute";
                default:
                    return "";
            }
        }

        public static string GetActionName(ActionEnum action)
        {
            switch (action)
            {
                case ActionEnum.Add:
                    return "add";
                case ActionEnum.Update:
                    return "update";
                case ActionEnum.Delete:
                    return "delete";
                default:
                    return "";
            }
        }

        public static string GetTerminalStatus(TerminalStatusEnum terminalStatus)
        {
            switch (terminalStatus)
            {
                case TerminalStatusEnum.running:
                    return "Running";
                case TerminalStatusEnum.stopped:
                    return "Stopped";
                case TerminalStatusEnum.closed:
                    return "Closed";
                default:
                    return "";
            }
        }
    }
}
