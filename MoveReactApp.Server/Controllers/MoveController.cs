using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Helper;
using MoveReactApp.Server.Models;
using System.Net;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "INTERNET\\Domain Users")]
    public class MoveController : ControllerBase
    {
        private readonly Operations operations = new();
        private readonly ILogger<MoveController> _logger;

        public MoveController(ILogger<MoveController> logger)
        {
            _logger = logger;
        }

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
            try
            {
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
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
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
        public IActionResult GetFiles([FromForm] IFormCollection form)
        {
            string directory = form["directory"];
            try
            {
                return Ok(GetFiles(directory));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
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
                    new MoveFileDTO
                    {
                        Destination = destination,
                        File = file,
                        Reason = reason
                    },
                    username
                );
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, "Failed to move file");
            }

            string directory = file[..file.LastIndexOf('\\')];
            try
            {
                return Ok(GetFiles(directory));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("DeleteFile")]
        public IActionResult DeleteFile([FromForm] IFormCollection form)
        {
            string directory = form["directory"];
            FileInfo fileInfo = new FileInfo(directory);
            try
            {
                fileInfo.Delete();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError, "Failed to delete file");
            }
            try
            {
                return Ok(GetFiles(directory[..directory.LastIndexOf('\\')]));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, ex.Message);
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("DeleteAll")]
        public ActionResult DeleteAll([FromForm] IFormCollection form)
        {
            string directory = form["directory"];
            string[] files = Directory.GetFiles(directory);
            bool anyError = false;
            string msg = "";
            foreach (string file in files)
                try
                {
                    new FileInfo(file).Delete();
                }
                catch (Exception ex)
                {
                    msg = $"Can not delete file: {file}";
                    _logger.LogError(ex, msg);
                    anyError = true;
                }
            if (anyError)
                return StatusCode((int)HttpStatusCode.InternalServerError, msg);
            else
                return Ok();
        }
    }
}
