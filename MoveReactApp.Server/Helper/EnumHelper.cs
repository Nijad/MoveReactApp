namespace MoveReactApp.Server.Helper
{
    public enum TableEnum
    {
        Configurations,
        Extension,
        Department,
        DepartmentExtensions
    }

    public enum ActionEnum
    {
        Add,
        Update,
        Delete
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
    }
}
