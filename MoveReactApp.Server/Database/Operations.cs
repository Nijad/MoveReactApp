using MoveReactApp.Server.Models;
using System.Data;
using System.Runtime.CompilerServices;

namespace MoveReactApp.Server.Database
{
    public static class Operations
    {
        private static readonly DB dB = new DB();
        private static string DicrectionConvert(int direnction)
        {
            switch (direnction)
            {
                case 1:
                    return "IN";
                case 2:
                    return "OUT";
                case 3:
                    return "IN/OUT";
                default:
                    return "IN/OUT";
            }
        }

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
            //return FakeData.Departments();

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
            return FakeData.Extensions();

            string query = "select * from extension";
            DataTable dt = dB.ExecuteReader(query);
            List<Extension> extensions = new List<Extension>();
            int i = 0;
            foreach (DataRow dr in dt.Rows)
            {
                Extension ext = new()
                {
                    Ext = dr["ext"].ToString(),
                    Program = dr["program"].ToString(),
                    Note = dr["note"].ToString(),
                    Enabled = dr["enabled"].ToString() == "1" ? true : false
                };
                extensions.Add(ext);
            }
            return extensions;
        }

        public static string[] GetExtensionNames()
        {
            //return FakeData.Extensions().Select(x => x.Ext).ToArray();

            string query = "select ext from extension";
            DataTable dt = dB.ExecuteReader(query);

            string[] extensions = new string[dt.Rows.Count];
            int i = 0;
            foreach (DataRow dr in dt.Rows)
            {
                extensions[i] = dr["ext"].ToString();
                i++;
            }
            return extensions;
        }

        public static Extension GetExtension(string ext)
        {
            //return GetExtensions().Where(x => x.Ext == ext).FirstOrDefault();

            Extension extension = new();
            string query = $"select * from extension where ext = '{ext}'";
            DataTable dt = dB.ExecuteReader(query);
            if (dt.Rows.Count > 0)
            {
                extension.Ext = dt.Rows[0]["ext"].ToString();
                extension.Program = dt.Rows[0]["program"].ToString();
                extension.Note = dt.Rows[0]["note"].ToString();
                extension.Enabled = dt.Rows[0]["enabled"].ToString() == "1" ? true : false;

                query = $"select * from dept_ext where ext = '{ext}'";
                DataTable dt2 = dB.ExecuteReader(query);
                if (dt2.Rows.Count > 0)
                {
                    int i = 0;
                    extension.Departments = new List<ExtensionDepts>();
                    foreach (DataRow dr in dt2.Rows)
                    {
                        extension.Departments.Add(
                            new ExtensionDepts()
                            {
                                Department = dr["dept"].ToString(),
                                Direction = DicrectionConvert(int.Parse(dr["direction"].ToString())),
                                Ext = ext,
                                Id = i
                            }
                        );
                        i++;
                    }
                }
            }
            return extension;
        }

        public static void AddExtension(Extension extension)
        {
            string query = "INSERT INTO `movedb`.`extension` " +
                "(`ext`,`program`,`enabled`,`note`)" +
                $"VALUES ('{extension.Ext}','{extension.Program}',{extension.Enabled},'{extension.Note}')";

            dB.ExecuteNonQuery(query);
        }

        public static void UpdateExtension(string ext, Extension extension)
        {
            string query = "UPDATE `movedb`.`extension` SET " +
                $"`ext` = '{extension.Ext}', `program` ='{extension.Program}', `enabled` = {extension.Enabled}, " +
                $"`note` = '{extension.Note}' WHERE `ext` = '{ext}'";

            dB.ExecuteNonQuery(query);
        }

        public static void DeleteExtension(string ext)
        {
            string query = $"DELETE FROM `movedb`.`extension` WHERE `ext` =  '{ext}'";
            dB.ExecuteNonQuery(query);
        }

        public static List<ExtensionDepts> GetDeptExtensions(string dept, bool enabledExt = true)
        {
            List<ExtensionDepts> extensionDepts = new();
            string query = $"select e.ext, e.program, ed.direction, e.note, e.enabled " +
                $"from extension as e, dept_ext as ed, department as d " +
                $"where e.ext = ed.ext and ed.dept = d.dept and d.dept = '{dept}'";
            query += enabledExt ? $" and e.enabled = 1" : "";
            DataTable dt = dB.ExecuteReader(query);
            foreach (DataRow dr in dt.Rows)
            {
                ExtensionDepts ext = new()
                {
                    Ext = dr["ext"].ToString(),
                    Department = dr["department"].ToString(),
                    Direction = DicrectionConvert(int.Parse(dr["direction"].ToString())),
                };

                extensionDepts.Add(ext);
            }
            return extensionDepts;
        }

        public static List<ExtensionDepts> GetExtDepartments(string ext, bool enabledDept = true)
        {
            return FakeData.ExtensionDepts().Where(x => x.Ext == ext).ToList();

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
                    Ext = dr["ext"].ToString(),
                    Department = dr["dept"].ToString(),
                    Direction = DicrectionConvert(int.Parse(dr["direction"].ToString())),
                };
                extDepts.Add(depts);
            }
            return extDepts;
        }

        internal static string[] GetDepartmentNames()
        {
            //return FakeData.departmentNames;

            string query = "select dept from department";
            DataTable dt = dB.ExecuteReader(query);
            string[] departments = new string[dt.Rows.Count];
            int i = 0;
            foreach (DataRow dr in dt.Rows)
            {
                departments[i] = dr["dept"].ToString();
                i++;
            }
            return departments;
        }
    }
}
