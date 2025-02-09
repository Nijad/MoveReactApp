using MoveReactApp.Server.Models;
using System.Data;

namespace MoveReactApp.Server.Database
{
    public class Operations
    {
        private readonly DB dB = new DB();
        private string DirectionConvert(int direction)
        {
            switch (direction)
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

        private int DirectionConvertInverse(string dirction)
        {
            switch (dirction)
            {
                case "IN":
                    return 1;
                case "in":
                    return 1;
                case "OUT":
                    return 2;
                case "out":
                    return 2;
                case "IN/OUT":
                    return 3;
                case "in/out":
                    return 3;
                default:
                    return 3;
            }
        }

        public List<Configuration> GetConfig()
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

        public List<Department> GetDepartments()
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

        public List<Extension> GetExtensions()
        {
            //return FakeData.Extensions();

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

        public string[] GetExtensionNames()
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

        public Extension GetExtension(string ext)
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
                extension.Departments = GetExtDepartments(ext);
            }
            return extension;
        }

        

        public void AddExtension(Extension extension)
        {
            string query = "INSERT INTO `movedb`.`extension` " +
                "(`ext`,`program`,`enabled`,`note`)" +
                $"VALUES ('{extension.Ext}','{extension.Program}',{extension.Enabled},'{extension.Note}')";

            dB.ExecuteNonQuery(query);
        }

        public void UpdateExtension(string ext, Extension extension)
        {
            string query = "UPDATE `movedb`.`extension` SET " +
                $"`ext` = '{extension.Ext}', `program` ='{extension.Program}', `enabled` = {extension.Enabled}, " +
                $"`note` = '{extension.Note}' WHERE `ext` = '{ext}'";

            dB.ExecuteNonQuery(query);
        }

        public void DeleteExtension(string ext)
        {
            string query = $"DELETE FROM `movedb`.`extension` WHERE `ext` =  '{ext}'";
            dB.ExecuteNonQuery(query);
        }

        public List<ExtensionDepts> GetDeptExtensions(string dept, bool enabledExt = true)
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
                    Direction = DirectionConvert(int.Parse(dr["direction"].ToString())),
                };

                extensionDepts.Add(ext);
            }
            return extensionDepts;
        }

        public List<ExtensionDepts> GetExtDepartments(string ext)
        {
            //return FakeData.ExtensionDepts().Where(x => x.Ext == ext).ToList();

            List<ExtensionDepts> extDepts = new();
            string query = $"select * from dept_ext where ext = '{ext}'";
            DataTable dt = dB.ExecuteReader(query);
            int i = 0;

            foreach (DataRow dr in dt.Rows)
            {
                extDepts.Add(
                    new ExtensionDepts()
                    {
                        Department = dr["dept"].ToString(),
                        Direction = DirectionConvert(int.Parse(dr["direction"].ToString())),
                        Ext = ext,
                        Id = i
                    }
                );
                i++;
            }
            return extDepts;
        }

        internal string[] GetDepartmentNames()
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

        internal void AddExtDept(ExtensionDepts extensionDepts)
        {
            string query = $"INSERT INTO dept_ext (dept,ext,direction) " +
                $"VALUES ('{extensionDepts.Department}', '{extensionDepts.Ext}',{DirectionConvertInverse(extensionDepts.Direction)})";
            dB.ExecuteNonQuery(query);
        }

        internal void DeleteExtDept(string ext, string dept)
        {
            string query = $"DELETE FROM dept_ext WHERE ext = '{ext}' AND dept = '{dept}'";
            dB.ExecuteNonQuery (query);
        }
    }
}
