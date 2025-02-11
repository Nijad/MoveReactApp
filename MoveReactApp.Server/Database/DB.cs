
using MySqlConnector;
using System.Data;

namespace MoveReactApp.Server.Database
{
    public class DB
    {
        string connectionString;
        MySqlConnection con;
        public DB()
        {
            string server = "127.0.0.1";
            string database = "movedb";
            string username = "moveuser";
            string password = "Move@123";

            connectionString = $"Server={server};Database={database};UID={username};Password={password};SslMode=None";
        }

        private void OpenDB()
        {
            con = new MySqlConnection(connectionString);
            con.Open();
        }

        private void CloseDB()
        {
            con.Close();
        }

        public void ExecuteNonQuery(string query)
        {
            OpenDB();
            MySqlCommand cmd = new MySqlCommand(query, con);
            cmd.ExecuteNonQuery();
            CloseDB();
        }

        private MySqlCommand ExecuteTransaction(string query)
        {
            OpenDB();
            MySqlCommand cmd = new MySqlCommand(query, con);
            MySqlTransaction transaction;
            transaction = con.BeginTransaction();
            cmd.Transaction = transaction;
            cmd.ExecuteNonQuery();
            return cmd;
        }

        public DataTable ExecuteReader(string query)
        {
            OpenDB();
            MySqlCommand cmd = new MySqlCommand(query, con);
            MySqlDataReader dr = cmd.ExecuteReader();
            DataTable dt = new DataTable();
            dt.Load(dr);
            CloseDB();
            return dt;
        }

        public void Commit(MySqlCommand cmd)
        {
            cmd.Transaction.Commit();
            CloseDB();
        }

        public void Rollback(MySqlCommand cmd)
        {
            cmd.Transaction.Rollback();
            CloseDB();
        }

        public void CheckDatabaseConnection()
        {
            try
            {
                OpenDB();
                CloseDB();
            }
            catch (Exception ex)
            {
                //write in log here
                string msg = "Can not connect database.";
                //Logging.WriteNotes(msg);
                //Logging.SendEmail(ex, msg);
                //Logging.LogException(ex);
                throw ex;
            }
        }

        //public MySqlCommand InsertIntoMovedFile(string name, string extension, string realExtension,
        //    long size, string dept, string destination)
        //{
        //    try
        //    {
        //        string query = "INSERT INTO `movedfiles`(`name`, `Ext`, `RealExt`, `size`, `Dept`, `Destination`) " +
        //            $"VALUES ('{name}', '{extension}', '{realExtension}', '{size}', '{dept}', '{destination}')";
        //        MySqlCommand cmd = ExecuteTransaction(query);
        //        return cmd;
        //    }
        //    catch (Exception ex)
        //    {
        //        string msg = "Can not write in database";
        //        //Logging.SendEmail(ex, msg);
        //        //Logging.LogException(ex);
        //    }
        //    return null;
        //}

    }
}
