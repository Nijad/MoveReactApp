using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;
using System.Net;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "INTERNET\\Domain Users")]
    public class DepartmentsController : ControllerBase
    {
        Operations operations = new();
        private readonly ILogger<DepartmentsController> _logger;

        public DepartmentsController(ILogger<DepartmentsController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public IEnumerable<Department> Get()
        {
            return operations.GetDepartments();
        }

        [HttpGet("names")]
        public IActionResult DepartmenstName()
        {
            try
            {
                return Ok(operations.GetDepartmentNames());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get departments");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("{dept}")]
        public IActionResult Get(string dept)
        {
            try
            {
                return Ok(operations.GetDepartment(dept));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to get department: {dept}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost]
        public IActionResult Post([FromForm] IFormCollection form)
        {
            try
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
                return Ok(operations.GetDepartmentNames().ToArray());
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"Failed to add department: {form["dept"].ToString()}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("update/{dept}")]
        public ActionResult Put(string dept, [FromForm] IFormCollection form)
        {
            try
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

                return Ok();
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"Failed to update department: {dept}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("delete/{dept}")]
        public IActionResult Delete(string dept)
        {
            try
            {
                operations.DeleteDepartment(dept);
                return Ok();
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete department: {dept}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
