using MoveReactApp.Server.Helper;
using MoveReactApp.Server.Models;
using MoveReactApp.Server.Models.DTOs;
using MySqlConnector;
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
            switch (dirction.ToLower())
            {
                case "in":
                    return 1;
                case "out":
                    return 2;
                case "in/out":
                    return 3;
                default:
                    return 3;
            }
        }

        public List<Configuration> GetConfig()
        {
            List<Configuration> configs = new();
            string query = "select * from config order by `order`";
            DataTable dt = dB.ExecuteReader(query);
            foreach (DataRow dr in dt.Rows)
            {
                configs.Add(new Configuration
                {
                    Order = int.Parse(dr["order"].ToString()),
                    Key = dr["key"].ToString(),
                    Value = dr["value"].ToString(),
                    FieldProps = dr["field_props"].ToString()
                });
            }
            return configs;
        }

        public string GetTerminalPath()
        {
            string query = "select value from config where `key` = 'terminal_path'";
            DataTable dt = dB.ExecuteReader(query);
            return dt.Rows[0]["value"].ToString();
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
            string escapeExt = MySqlHelper.EscapeString(extension.Ext);
            string escapeProgram = MySqlHelper.EscapeString(extension.Program);
            string escapeNote = MySqlHelper.EscapeString(extension.Note);
            string query = "INSERT INTO `movedb`.`extension` " +
                "(`ext`,`program`,`enabled`,`note`)" +
                $"VALUES ('{escapeExt}','{escapeProgram}',{extension.Enabled},'{escapeNote}')";

            dB.ExecuteNonQuery(query);
        }

        public void UpdateExtension(string ext, Extension extension)
        {
            string escapeExt = MySqlHelper.EscapeString(extension.Ext);
            string escapeProgram = MySqlHelper.EscapeString(extension.Program);
            string escapeNote = MySqlHelper.EscapeString(extension.Note);
            string query = "UPDATE `movedb`.`extension` SET " +
                $"`ext` = '{escapeExt}', `program` ='{escapeProgram}', `enabled` = {extension.Enabled}, " +
                $"`note` = '{escapeNote}' WHERE `ext` = '{ext}'";

            dB.ExecuteNonQuery(query);
        }

        public void DeleteExtension(string ext)
        {
            string query = $"DELETE FROM `movedb`.`extension` WHERE `ext` =  '{ext}'";
            dB.ExecuteNonQuery(query);
        }

        public List<ExtensionDepts> GetDeptExtensions(string dept)
        {
            List<ExtensionDepts> extDepts = new();
            string query = $"select * from dept_ext where dept = '{dept}'";
            DataTable dt = dB.ExecuteReader(query);
            int i = 0;

            foreach (DataRow dr in dt.Rows)
            {
                extDepts.Add(
                    new ExtensionDepts()
                    {
                        Department = dept,
                        Direction = DirectionConvert(int.Parse(dr["direction"].ToString())),
                        Ext = dr["ext"].ToString(),
                        Id = i
                    }
                );
                i++;
            }
            return extDepts;
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

        public string[] GetDepartmentNames()
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

        public void AddExtDept(ExtensionDepts extensionDepts)
        {
            string query = $"INSERT INTO dept_ext (dept,ext,direction) " +
                $"VALUES ('{extensionDepts.Department}', '{extensionDepts.Ext}',{DirectionConvertInverse(extensionDepts.Direction)})";
            dB.ExecuteNonQuery(query);
        }

        public void DeleteExtDept(ExtDeptDTO extDepts)
        {
            string query = $"DELETE FROM dept_ext WHERE ext = '{extDepts.Ext}' AND dept = '{extDepts.Department}'";
            dB.ExecuteNonQuery(query);
        }

        public Department GetDepartment(string dept)
        {
            Department department = new Department();
            string query = $"select * from department where dept = '{dept}'";
            DataTable dt = dB.ExecuteReader(query);
            if (dt.Rows.Count > 0)
            {
                department.Dept = dt.Rows[0]["dept"].ToString();
                department.Note = dt.Rows[0]["note"].ToString();
                department.Enabled = dt.Rows[0]["enabled"].ToString() == "1" ? true : false;
                department.NetPath = dt.Rows[0]["net_path"].ToString();
                department.LocalPath = dt.Rows[0]["local_path"].ToString();
                department.Extensions = GetDeptExtensions(dept);
            }

            return department;
        }

        internal void AddDepartment(Department department)
        {
            string escapedDept = MySqlHelper.EscapeString(department.Dept);
            string escapedLocalPath = MySqlHelper.EscapeString(department.LocalPath);
            string escapedNetPath = MySqlHelper.EscapeString(department.NetPath);
            string escapedNote = MySqlHelper.EscapeString(department.Note);

            string query = $"insert into department (dept, local_path, net_path, enabled, note) " +
                $"values ('{escapedDept}', '{escapedLocalPath}', '{escapedNetPath}', {department.Enabled}, '{escapedNote}')";

            dB.ExecuteNonQuery(query);
        }

        public void UpdateDepartment(string dept, Department department)
        {
            string escapedDept = MySqlHelper.EscapeString(department.Dept);
            string escapedLocalPath = MySqlHelper.EscapeString(department.LocalPath);
            string escapedNetPath = MySqlHelper.EscapeString(department.NetPath);
            string escapedNote = MySqlHelper.EscapeString(department.Note);

            string query = $"update department set dept = '{escapedDept}', local_path = '{escapedLocalPath}', net_path = '{escapedNetPath}', " +
                $"note  = '{escapedNote}', enabled = {department.Enabled} where dept = '{dept}'";
            dB.ExecuteNonQuery(query);
        }

        public void DeleteDepartment(string dept)
        {
            string query = $"delete from department where dept = '{dept}'";
            dB.ExecuteNonQuery(query);
        }

        public void UpdateDeptExt(ExtDeptDTO extDept)
        {
            string query = $"update dept_ext set direction = " +
                $"{DirectionConvertInverse(extDept.Direction)} " +
                $"where ext = '{extDept.Ext}' and dept = '{extDept.Department}'";
            dB.ExecuteNonQuery(query);
        }

        public void UpdateConfig(UpdateConfigDTO value)
        {
            string escapedValue = MySqlHelper.EscapeString(value.Value);
            string query = $"update config set value = '{escapedValue}' where `key` = '{value.Key}' ";
            dB.ExecuteNonQuery(query);
        }

        public MySqlCommand InsertIntoMovedFile(string name, string extension, string realExtension,
            long size, string dept, string destination, string movedBy, string reason)
        {
            string escapedName = MySqlHelper.EscapeString(name);
            string escapedReason = MySqlHelper.EscapeString(reason);
            try
            {
                string query = "INSERT INTO `movedfiles`(`name`, `Ext`, `RealExt`, `size`, `Dept`, `Destination`, `moved_by`, `reason`) " +
                    $"VALUES ('{escapedName}', '{extension}', '{realExtension}', '{size}', '{dept}', '{destination}', '{movedBy}', '{escapedReason}')";
                MySqlCommand cmd = dB.ExecuteTransaction(query);
                return cmd;
            }
            catch (Exception ex)
            {
                string msg = "Can not write in database";
                throw new Exception(msg, ex);
            }
            return null;
        }

        public void Commit(MySqlCommand cmd)
        {
            cmd.Transaction.Commit();
            dB.CloseDB();
        }

        public void Rollback(MySqlCommand cmd)
        {
            cmd.Transaction.Rollback();
            dB.CloseDB();
        }

        public string GetBackupPath()
        {
            string query = "SELECT `value` FROM config where `key` = 'Backup_Path'";
            DataTable dt = dB.ExecuteReader(query);
            return dt.Rows[0][0].ToString();
        }

        public void WriteLog(string username, string table, string action, string old_value, string new_value)
        {
            string escapedOldValue = MySqlHelper.EscapeString(old_value);
            string escapedNewValue = MySqlHelper.EscapeString(new_value);
            string query = "INSERT INTO `movedb`.`log` (`username`, `table_name`, `action`, `old_value`, `new_value`) " +
                $"VALUES ('{username}', '{table}', '{action}', '{escapedOldValue}', '{escapedNewValue}')";
            dB.ExecuteNonQuery(query);
        }

        public UpdateConfigDTO GetConfig(string key)
        {
            UpdateConfigDTO config = new();
            string escapedNote = MySqlHelper.EscapeString(key);
            List<Configuration> configs = new();
            string query = $"select * from config where `key` = '{escapedNote}'  order by `order`";
            DataTable dt = dB.ExecuteReader(query);
            config.Key = key;
            config.Value = dt.Rows[0]["value"].ToString();
            return config;
        }

        public ExtDeptDTO GetExtDept(string ext, string dept)
        {
            ExtDeptDTO extensionDept = new();
            string query = $"SELECT * FROM movedb.dept_ext where dept = '{dept}' and ext = '{ext}'";
            DataTable dt = dB.ExecuteReader(query);
            if (dt.Rows.Count > 0)
                extensionDept = new()
                {
                    Department = dt.Rows[0]["dept"].ToString(),
                    Direction = DirectionConvert(int.Parse(dt.Rows[0]["direction"].ToString())),
                    Ext = dt.Rows[0]["ext"].ToString(),
                };

            return extensionDept;
        }

        public /*TerminalAttribute?*/ void GetTerminalAttributes()
        {
            string query = "SELECT a.*, s.status_description FROM terminal_attributes a, " +
                "terminal_status s where a.status_id = s.status_id and a.terminal_no = 0";
            DataTable dt = dB.ExecuteReader(query);

            if (dt.Rows.Count > 0)
            {
                TerminalAttribute.StatusId = int.Parse(dt.Rows[0]["status_id"].ToString());
                TerminalAttribute.StatusDesc = dt.Rows[0]["status_description"].ToString();
                TerminalAttribute.ProcessId = string.IsNullOrEmpty(dt.Rows[0]["process_id"].ToString()) ?null: int.Parse(dt.Rows[0]["process_id"]?.ToString());
                TerminalAttribute.ProcessName = string.IsNullOrEmpty(dt.Rows[0]["process_name"].ToString())?null: dt.Rows[0]["process_name"]?.ToString();
                TerminalAttribute.ErrorMessage = string.IsNullOrEmpty(dt.Rows[0]["error_message"].ToString()) ? null : dt.Rows[0]["error_message"]?.ToString();
                TerminalAttribute.User = dt.Rows[0]["user"]?.ToString();
                TerminalAttribute.StartAt = string.IsNullOrEmpty(dt.Rows[0]["start_at"].ToString()) ? null : DateTime.Parse(dt.Rows[0]["start_at"].ToString());
                TerminalAttribute.StopAt = string.IsNullOrEmpty(dt.Rows[0]["stop_at"].ToString()) ? null : DateTime.Parse(dt.Rows[0]["stop_at"].ToString());
            }
        }

        public void StartStop(int statusNo, string username)
        {
            string query = "";
            MySqlCommand cmd;
            if (statusNo == 0)
            {
                if (TerminalAttribute.ProcessId != null)
                    throw new Exception("Program is already running");
                TerminalAttribute.TerminalPath = GetTerminalPath();
                TerminalAttribute.RunTerminal(username);
            }
            else
            {
                query = $"update terminal_attributes set status_id = 0, process_id = null, process_name = null, " +
                    $"stop_at =  SYSDATE() , user='{username}' where terminal_no = 0";
                cmd = dB.ExecuteTransaction(query);
                try
                {
                    TerminalAttribute.TerminateTerminal();
                    Commit(cmd);
                }
                catch (ArgumentException ex)
                {
                    TerminalAttribute.ProcessId = null;
                    Commit(cmd);
                }
                catch (Exception ex)
                {
                    if (ex.Message == "Access is denied.")
                    {
                        Commit(cmd);
                        return;
                    }
                    Rollback(cmd);
                    throw ex;
                }
            }
        }

        public void StopWithError(string errorMessage, TerminalStatusEnum setStatus)
        {
            string query = $"update terminal_attributes set status_id = {(int)setStatus}, " +
                $"error_message='{errorMessage}', " +
                $"stop_at =  SYSDATE() where terminal_no = 0";
            dB.ExecuteNonQuery(query);
        }
    }
}
