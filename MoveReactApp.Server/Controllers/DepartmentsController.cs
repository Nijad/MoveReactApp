using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        List<Department> departments = new() {
            new Department()
            {
                Dept="IT",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="RISK",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="AUDIT",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="RETAIL",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="CREDIT",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="INFORMATION SECURITY",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="INTERNATIONAL",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
            new Department()
            {
                Dept="BACK OFFICE",
                LocalPath="Local Path",
                NetPath= "Net Path",
                Note="",
                Enabled=true
            },
        };
        // GET: api/<Departments>
        [HttpGet]
        public IEnumerable<Department> Get()
        {
            return departments;
            return Operations.GetDepartments();
        }

        [HttpGet("names")]
        public string[] DepartmenstName()
        {
            return departments.Select(x => x.Dept).ToArray();
        }

        // GET api/<Departments>/5
        [HttpGet("{dept}")]
        public IEnumerable<ExtensionDepts> Get(string dept)
        {
            return Operations.GetDeptExtensions(dept);
        }

        // POST api/<Departments>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<Departments>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Departments>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
