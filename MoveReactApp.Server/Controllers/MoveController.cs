using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        Operations operations = new();
        // GET: api/<MoveController>
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

        // GET api/<MoveController>/5
        [HttpPost("GetFiles")]
        public List<FileInfoDTO> GetFiles([FromBody] DirectoryDTO directory)
        {
            DirectoryInfo directoryInfo = new DirectoryInfo(directory.Directory);
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
                    Extension = file.Extension.Split('.')[1],
                    Length = file.Length
                });
            }
            return filesInfo;
        }

        // POST api/<MoveController>
        [HttpPost("MoveFile")]
        public List<FileInfoDTO> MoveFile([FromBody] MoveFileDTO moveData)
        {
            FileInfo fileInfo = new FileInfo(moveData.File);
            string[] fileNameSegmants = moveData.File.Split('\\');
            string destination = Path.Combine(moveData.Destination, fileNameSegmants[fileNameSegmants.Length-1]);
            fileInfo.MoveTo(destination);
            DirectoryDTO dto = new() { Directory = moveData.File[..moveData.File.LastIndexOf('\\')] };
            return GetFiles(dto);
        }
        
        // POST api/<MoveController>
        [HttpPost("DeleteFile")]
        public List<FileInfoDTO> DeleteFile([FromBody] MoveFileDTO moveData)
        {
            FileInfo fileInfo = new FileInfo(moveData.File);
            fileInfo.Delete();
            DirectoryDTO dto = new() { Directory = moveData.File[..moveData.File.LastIndexOf('\\')] };
            return GetFiles(dto);
        }

        [HttpPost("DeleteAll")]
        public List<FileInfoDTO> DeleteAll([FromBody] DirectoryDTO directory)
        {
            string[] files = Directory.GetFiles(directory.Directory);
            foreach (string file in files)
                new FileInfo(file).Delete();

            return GetFiles(directory);
        }
    }
}
