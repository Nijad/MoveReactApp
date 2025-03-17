using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Helper;
using MoveReactApp.Server.Models;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "INTERNET\\Domain Users")]
    public class MoveController : ControllerBase
    {
        //private readonly IHttpContextAccessor context;
        Operations operations = new();
        //public MoveController(IHttpContextAccessor _context)
        //{
        //    context = _context;
        //}
        
        [HttpGet]
        public DirectoriesDTO Get()
        {
            DirectoriesDTO directoriesDTO = new()
            {
                Name = "Departments",
                IsOpen = true,
                Children = new(),
                DisplayDirectory = "\\\\"
            };

            List<Department> depts = operations.GetDepartments();
            foreach (Department dept in depts)
            {
                directoriesDTO.Children.Add(new()
                {
                    Name = dept.Dept,
                    IsOpen = false,
                    DisplayDirectory = $"\\\\{dept.Dept.ToUpper()}",
                    Children = new()
                    {
                        new()
                        {
                            Name = "Local",
                            IsOpen = false,
                            CanMove = CanMove(dept.LocalPath),
                            Directory = dept.LocalPath,
                            DisplayDirectory = $"\\\\{dept.Dept.ToUpper()}\\LOCAL",
                            Children = GetSubDirectories(
                                dept.LocalPath,
                                $"{dept.Dept.ToUpper()}\\LOCAL",
                                dept.NetPath + "\\IN"
                            )
                        },
                        new()
                        {
                            Name = "Net",
                            IsOpen = false,
                            Directory = dept.NetPath,
                            CanMove = CanMove(dept.NetPath),
                            DisplayDirectory = $"\\\\{dept.Dept.ToUpper()}\\NET",
                            Children = GetSubDirectories(
                                dept.NetPath,
                                $"{dept.Dept.ToUpper()}\\NET",
                                dept.LocalPath + "\\IN"
                            )
                        }
                    }
                });
            }
            return directoriesDTO;
        }

        private bool CanMove(string path)
        {
            if (path.ToLower().EndsWith("\\out") || path.ToLower().Contains("\\out\\"))
                return true;
            return false;
        }

        private List<DirectoriesDTO>? GetSubDirectories(string directory, string displayOfParent, string destination)
        {
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            string[] directories = Directory.GetDirectories(directory);

            List<DirectoriesDTO> directoriesDTOs = new();

            foreach (string dir in directories)
            {
                string name = dir.Split('\\')[dir.Split('\\').Length - 1];
                string displayDirectory = $"{displayOfParent}\\{name.ToUpper()}";
                bool canMove = CanMove(dir);
                directoriesDTOs.Add(new()
                {
                    Name = name,
                    IsOpen = false,
                    CanMove = canMove,
                    Directory = dir,
                    DisplayDirectory = displayDirectory,
                    Destination = destination,
                    Children = GetSubDirectories(dir, displayDirectory, destination)
                });
            }
            return directoriesDTOs;
        }

        [HttpPost("GetFiles")]
        public List<FileInfoDTO> GetFiles([FromForm] IFormCollection form)
        {
            string directory = form["directory"];
            return GetFiles(directory);
        }

        private static List<FileInfoDTO> GetFiles(string directory)
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(directory);
            FileInfo[] files = directoryInfo.GetFiles();
            List<FileInfoDTO> filesInfo = new();
            int i = 0;
            foreach (FileInfo file in files)
            {
                filesInfo.Add(new()
                {
                    Id = i++,
                    Path = file.FullName,
                    Name = file.Name,
                    Extension = file.Extension.Split('.').Length > 1 ?
                        file.Extension.Split('.')[file.Extension.Split('.').Length - 1] : "",
                    Length = file.Length
                });
            }
            return filesInfo;
        }

        [HttpPost("MoveFile")]
        public IActionResult MoveFile([FromForm] IFormCollection form)
        {
            string file = form["File"].ToString();
            string destination = form["Destination"].ToString();
            string reason = form["Reason"].ToString();

            string username = HttpContext.User.Identity?.Name;
            username = username.Substring(username.LastIndexOf('\\') + 1);

            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            try
            {
                MoveHelper.Move(
                    new MoveFileDTO { 
                        Destination = destination, 
                        File = file, 
                        Reason = reason 
                    },
                    username
                );
            }
            catch (Exception)
            {
                throw;
            }

            string directory = file[..file.LastIndexOf('\\')] ;
            return Ok(GetFiles(directory));
        }

        [HttpPost("DeleteFile")]
        public List<FileInfoDTO> DeleteFile([FromForm] IFormCollection form)
        {
            string directory = form["directory"];
            FileInfo fileInfo = new FileInfo(directory);
            fileInfo.Delete();
            return GetFiles(directory[..directory.LastIndexOf('\\')]);
        }

        [HttpPost("DeleteAll")]
        public List<FileInfoDTO> DeleteAll([FromForm] IFormCollection form)
        {
            string directory = form["directory"];
            string[] files = Directory.GetFiles(directory);
            foreach (string file in files)
                new FileInfo(file).Delete();

            return GetFiles(directory);
        }
    }
}
