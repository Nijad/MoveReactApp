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
            DirectoriesDTO directoriesDTO = new DirectoriesDTO() { Name = "Departments", IsOpen = true, Children = new() };
            List<Department> depts = operations.GetDepartments();
            foreach (Department dept in depts)
            {
                directoriesDTO.Children.Add(new()
                {
                    Name = dept.Dept,
                    IsOpen = false,
                    Children = new()
                    {
                        new()
                        {
                            Name = "Local",
                            IsOpen = false,
                            Directory = dept.LocalPath,
                            Children = GetSubDirectories(dept.LocalPath)
                        },
                        new()
                        {
                            Name = "Net",
                            IsOpen = false,
                            Directory = dept.NetPath,
                            Children = GetSubDirectories(dept.NetPath)
                        }
                    }
                });
            }
            return directoriesDTO;
        }

        private List<DirectoriesDTO>? GetSubDirectories(string directory)
        {
            if (!Directory.Exists(directory))
                Directory.CreateDirectory(directory);

            string[] directories = Directory.GetDirectories(directory);

            List<DirectoriesDTO> directoriesDTOs = new();

            foreach (string d in directories)
            {
                directoriesDTOs.Add(new()
                {
                    Directory = d,
                    IsOpen = false,
                    Name = d.Split('\\')[d.Split('\\').Length - 1],
                    Children = GetSubDirectories(d)
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
            foreach (FileInfo file in files)
            {
                filesInfo.Add(new()
                {
                    FullName = file.FullName,
                    Name = file.Name,
                    Extension = file.Extension,
                    Length = file.Length
                });
            }
            return filesInfo;
        }

        // POST api/<MoveController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<MoveController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MoveController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
