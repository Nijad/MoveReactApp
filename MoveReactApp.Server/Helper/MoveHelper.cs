using HeyRed.Mime;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;
using MySqlConnector;

namespace MoveReactApp.Server.Helper
{
    public static class MoveHelper
    {
        private static Operations operations = new();

        private static string GetFileType(FileInfo fileInfo)
        {
            string file = fileInfo.FullName;
            List<string> s = file.Split('\\', StringSplitOptions.RemoveEmptyEntries).ToList();
            string[] d = s[s.Count - 1].Split('.', StringSplitOptions.RemoveEmptyEntries);
            string g = string.Join('\\', s.Take(s.Count - 1));
            //get extension if there are many dots in file name
            g = $"\\\\{g}\\e.{d[d.Length - 1]}";
            //rename file before chech file type
            //because it does not work with arabic name files
            
            fileInfo.MoveTo(g);
            FileType fileType = MimeGuesser.GuessFileType(g);
            fileInfo.MoveTo(file);
            return fileType.Extension;
        }

        private static void MoveToDestination(MoveFileDTO movedData)
        {
            throw new Exception();
            FileInfo file = new(movedData.File);
            try
            {
                string fl = movedData.File;
                if (File.Exists(movedData.File))
                {
                    string datetime = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");
                    string[] fileParts = file.Name.Split('.');
                    file.MoveTo(movedData.Destination + $"\\{fileParts[0]}-{datetime}.{fileParts[1]}");
                }
                else
                    file.MoveTo(movedData.Destination + $"\\{file.Name}");
            }
            catch (Exception ex)
            {
                string msg = "Can not move file to destination folder";
                msg += $"\nfile name : {file.Name} - dept : {movedData.Dept} - destination : {movedData.Destination}";
                //Logging.WriteNotes(msg);
                //Logging.LogException(ex);
                //Logging.SendEmail(ex, msg);
                throw new Exception(msg);
            }
        }

        private static string CopyToBackup(MoveFileDTO movedData)
        {
            FileInfo fileInfo = new(movedData.File);
            try
            {
                
                string backupFile = "";
                string BackupPath = operations.GetBackupPath();
                if (!Directory.Exists(BackupPath))
                    Directory.CreateDirectory(BackupPath);
                string today = DateTime.Now.ToString("yyyy-MM-dd");

                BackupPath += $"\\{today}";
                if (!Directory.Exists(BackupPath))
                    Directory.CreateDirectory(BackupPath);

                BackupPath += $"\\{movedData.Dept}";
                if (!Directory.Exists(BackupPath))
                    Directory.CreateDirectory(BackupPath);

                BackupPath += $"\\Moved_To-{movedData.Dest}";
                if (!Directory.Exists(BackupPath))
                    Directory.CreateDirectory(BackupPath);

                string fl = BackupPath + $"\\{fileInfo.Name}";
                if (File.Exists(fl))
                {
                    string datetime = DateTime.Now.ToString("yyyy-MM-dd_HH-mm-ss");
                    string[] fileParts = fileInfo.Name.Split('.');
                    backupFile = BackupPath + $"\\{fileParts[0]}-{datetime}.{fileParts[1]}";
                }
                else
                    backupFile = BackupPath + $"\\{fileInfo.Name}";
                fileInfo.CopyTo(backupFile);
                return backupFile;
            }
            catch (Exception ex)
            {
                string msg = "Can not move file to audit folder";
                msg += $"\nfile name : {fileInfo.Name} - dept : {movedData.Dept} - destination : {movedData.Destination}";
                //Logging.WriteNotes(msg);
                //Logging.LogException(ex);
                //Logging.SendEmail(ex, msg);
                throw new Exception(msg);
            }
        }


        private static void DeleteFile(string backupFile)
        {
            try
            {
                File.Delete(backupFile);
            }
            catch (Exception ex)
            {
                string msg = "Can not delete file from backup folder";
                //Logging.WriteNotes(msg);
                //Logging.LogException(ex);
            }
        }

        public static void Move(MoveFileDTO moveData)
        {
            FileInfo fileInfo = new FileInfo(moveData.File);
            string[] fileNameSegmants = moveData.File.Split('\\');
            string destination = Path.Combine(moveData.Destination, fileNameSegmants[fileNameSegmants.Length - 1]);
            //start write in database

            MySqlCommand cmd = null;
            try
            {
                cmd = operations.InsertIntoMovedFile(
                    fileInfo.Name,
                    fileInfo.Extension.Split('.')[1],
                    GetFileType(fileInfo), 
                    fileInfo.Length,
                    moveData.Dept, 
                    moveData.Destination,
                    "nijad test",
                    moveData.Reason);
            }
            catch (Exception ex)
            {
                string msg = ex.Message;
                msg += $"\nfile name : {fileInfo.Name} - dept : {moveData.Dept} - destination : {moveData.Destination}";
                //Logging.WriteNotes(msg);
                throw new Exception(msg);
            }


            //copy file to audit folder
            string backupFile;
            try
            {
                backupFile = CopyToBackup(moveData);
            }
            catch (Exception ex)
            {
                operations.Rollback(cmd);
                throw new Exception(ex.Message);
            }

            //move file to destination folder
            try
            {
                MoveToDestination(moveData);
                operations.Commit(cmd);
            }
            catch (Exception)
            {
                if (!string.IsNullOrEmpty(backupFile))
                    DeleteFile(backupFile);
                operations.Rollback(cmd);
            }  
        }
    }
}
