using MoveReactApp.Server.Models;
using System.Collections.Generic;
using static System.Net.Mime.MediaTypeNames;

namespace MoveReactApp.Server.Database
{
    public static class FakeData
    {
        private static Random random = new Random();

        private static string[] direction = ["IN", "OUT", "IN/OUT"];

        public static string[] departmentNames = [
            "accounting",
            "administrative",
            "audit",
            "back office",
            "camera",
            "central bank",
            "compliance",
            "credit adminstration",
            "electronic payments",
            "external audit",
            "gm",
            "gm office",
            "hr",
            "it icbs",
            "it network",
            "it admins",
            "it audit",
            "it security",
            "international",
            "legal",
            "mis",
            "operation",
            "operator",
            "organizations & vip",
            "retail",
            "risk",
            "trade sevices",
        ];

        public static List<Department> Departments()
        {
            List<Department> departments = new();
            List<ExtensionDepts> allExtensions = ExtensionDepts();
            foreach (string dept in departmentNames.Order())
            {
                departments.Add(new()
                {
                    Dept = dept,
                    Enabled = true,// random.Next(2) == 0 ? false : true,
                    LocalPath = $"{dept}-localPath",
                    NetPath = $"{dept}-netPath",
                    Note = "",
                    Extensions = allExtensions.Where(x => x.Department == dept).ToList(),
                    RemainExtensions = allExtensions.Where(x => x.Department != dept).ToList(),
                });
            }
            return departments;
        }

        public static string[] extensionNames = [
            "doc",
            "docx",
            "xls",
            "xlsx",
            "ppt",
            "pptx",
            "png",
            "jpg",
            "jpeg",
            "gif",
            "rar",
            "zip",
        ];

        public static List<Extension> Extensions()
        {
            List<Extension> extensions = new();
            List<ExtensionDepts> allDepartments = ExtensionDepts();
            foreach (string ext in extensionNames.Order())
            {
                List<ExtensionDepts> depts = allDepartments.Where(x => x.Ext == ext).ToList();
                List<string> remainDepts = GetRemainDepts(depts, ext);
                extensions.Add(new()
                {
                    Ext = ext,
                    Program = "any program",
                    Note = "",// random.Next(2) == 0 ? false : true,
                    Enabled = true,
                    Departments = depts,
                    RemainDepartments = remainDepts
                });
            }
            return extensions;
        }

        private static List<string> GetRemainDepts(List<ExtensionDepts> depts, string ext)
        {
            for (int i = 0; i < departmentNames.Count(); i++)
                departmentNames[i]= departmentNames[i].ToUpper();
            return departmentNames.ToList();
            //string[] remainDeptNames = departmentNames.Except(depts.Select(x => x.Department)).ToArray();
            //List<ExtensionDepts> remainDepartments = new();
            //foreach (string dept in remainDeptNames)
            //{
            //    remainDepartments.Add(new()
            //    {
            //        Ext = ext,
            //        Department = dept,
            //        Direction = "IN/OUT"
            //    });
            //}
            //return remainDepartments;
        }

        public static List<ExtensionDepts> ExtensionDepts()
        {
            int id = 0;
            List<ExtensionDepts> extDepts = new();
            foreach (string ext in extensionNames)
            {
                int i = 0;
                List<string> deptsAdded = new();
                while (i < 10)
                {
                    ExtensionDepts dept = new()
                    {
                        Id = id,
                        Ext = ext,
                        Department = departmentNames[random.Next(departmentNames.Length)],
                        Direction = direction[random.Next(3)]
                    };
                    if (!deptsAdded.Contains(dept.Department))
                    {
                        deptsAdded.Add(dept.Department);
                        extDepts.Add(dept);
                        i++;
                        id++;
                    }
                }
            }
            return extDepts;
        }
    }
}
