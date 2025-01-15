using MoveReactApp.Server.DTO;
using MoveReactApp.Server.Models;
using System.Collections.Generic;
using System.Data;

namespace MoveReactApp.Server.Database
{
    public static class Operations
    {
        private static readonly DB dB = new DB();

        public static List<Configuration> GetConfig()
        {
            List<Configuration> configs = new();
            string query = "select * from config";
            DataTable dt = dB.ExecuteReader(query);
            foreach (DataRow dr in dt.Rows)
            {
                configs.Add(new Configuration
                {
                    Key = dr["key"].ToString(),
                    Value = dr["value"].ToString(),
                    Note = dr["note"].ToString()
                });
            };
            return configs;
        }

        public static List<Department> GetDepartments()
        {
            List<Department> departments = new();
            string query = "select * from department";
            DataTable dt = dB.ExecuteReader(query);
            foreach (DataRow dr in dt.Rows)
            {
                Department dept = new()
                {
                    Dept = dr["dept"].ToString(),
                    LocalPath = dr["local_path"].ToString(),
                    NetPath = dr["net_path"].ToString(),
                    Note = dr["note"].ToString(),
                    Enabled = dr["enabled"].ToString() == "1" ? true : false,
                };

                departments.Add(dept);
            }
            return departments;
        }

        public static List<Extension> GetExtensions()
        {
            string query = "select * from extension";

            DataTable dt = dB.ExecuteReader(query);

            List<Extension> extensions = new List<Extension>();

            foreach (DataRow dr in dt.Rows)
            {
                Extension ext = new()
                {
                    Ext = dr["ext"].ToString(),
                    Program = dr["program"].ToString(),
                    Enabled = dr["enabled"].ToString() == "1" ? true : false
                };
                extensions.Add(ext);
            }

            return extensions;
        }

        public static List<DepartmentExts> GetDeptExtensions(string dept, bool enabledExt = true)
        {
            List<DepartmentExts> extensionDepts = new();
            string query = $"select e.ext, e.program, ed.direction, e.note, e.enabled " +
                $"from extension as e, dept_ext as ed, department as d " +
                $"where e.ext = ed.ext and ed.dept = d.dept and d.dept = '{dept}'";
            query += enabledExt ? $" and e.enabled = 1" : "";
            DataTable dt = dB.ExecuteReader(query);
            foreach (DataRow dr in dt.Rows)
            {
                DepartmentExts ext = new()
                {
                    Extenion = dr["ext"].ToString(),
                    Program = dr["program"].ToString(),
                    Direction = int.Parse(dr["direction"].ToString()),
                    Note = dr["note"].ToString(),
                    Enabled = dr["enabled"].ToString() == "1" ? true : false
                };

                extensionDepts.Add(ext);
            }
            return extensionDepts;
        }

        public static List<ExtensionDepts> GetExtDepartments(string ext, bool enabledDept = true)
        {
            List<ExtensionDepts> extDepts = new();
            string query = $"select ed.dept, d.local_path, d.net_path, ed.direction, d.note, d.enabled " +
                "from extension as e, dept_ext as ed, department as d " +
                $"where e.ext = ed.ext and ed.dept = d.dept and e.ext = '{ext}'";
            query += enabledDept ? " and d.enabled = 1" : "";
            DataTable dt = dB.ExecuteReader(query);
            foreach (DataRow dr in dt.Rows)
            {
                ExtensionDepts depts = new()
                {
                    Department = dr["dept"].ToString(),
                    LocalPath = dr["local_path"].ToString(),
                    NetPath = dr["net_path"].ToString(),
                    Direction = int.Parse(dr["direction"].ToString()),
                    Note = dr["note"].ToString(),
                    Enabled = dr["enabled"].ToString() == "1" ? true : false
                };
                extDepts.Add(depts);
            }
            return extDepts;
        }

    }
}
