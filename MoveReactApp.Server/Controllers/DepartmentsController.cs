using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    //[Authorize]
    public class DepartmentsController : ControllerBase
    {
        Operations operations = new();
        //private readonly ILogger<DepartmentsController> _logger;

        //public DepartmentsController(ILogger<DepartmentsController> logger)
        //{
        //    _logger = logger;
        //}

        // GET: api/<Departments>
        [HttpGet]
        public IEnumerable<Department> Get()
        {
            //_logger.LogInformation("User authenticated: {User}", HttpContext.User.Identity?.Name);
            if (HttpContext.User.Identity?.IsAuthenticated != true)
            {
                return operations.GetDepartments();
            }
            return operations.GetDepartments();
        }

        [HttpGet("names")]
        public string[] DepartmenstName()
        {
            //_logger.LogInformation("User authenticated: {User}", HttpContext.User.Identity?.Name);
            return operations.GetDepartmentNames();

        }

        // GET api/<Departments>/5
        [HttpGet("{dept}")]
        public Department Get(string dept)
        {
            return operations.GetDepartment(dept);
        }

        // POST api/<Departments>
        [HttpPost]
        public string[] Post([FromForm] IFormCollection form)
        {
            Department department = new()
            {
                Dept = form["dept"].ToString(),
                Enabled = bool.Parse(form["enabled"].ToString()),
                Extensions = new(),
                LocalPath = form["localPath"].ToString(),
                NetPath = form["netPath"].ToString(),
                Note = form["note"]
            };
            operations.AddDepartment(department);
            return operations.GetDepartmentNames().ToArray();
        }

        // PUT api/<Departments>/5
        [HttpPost("update/{dept}")]
        public void Put(string dept, [FromForm] IFormCollection form)
        {
            Department department = new()
            {
                Dept = form["dept"].ToString(),
                Enabled = bool.Parse(form["enabled"].ToString()),
                Extensions = new(),
                LocalPath = form["localPath"].ToString(),
                NetPath = form["netPath"].ToString(),
                Note = form["note"]
            };
            operations.UpdateDepartment(dept, department);
        }

        // DELETE api/<Departments>/5
        [HttpPost("delete/{dept}")]
        public void Delete(string dept)
        {
            operations.DeleteDepartment(dept);
        }
    }
}
