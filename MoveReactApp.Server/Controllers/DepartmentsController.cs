using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Helper;
using MoveReactApp.Server.Models;
using Newtonsoft.Json;
using System.Net;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "INTERNET\\Domain Users")]
    public class DepartmentsController : ControllerBase
    {
        private readonly ILogger<DepartmentsController> _logger;
        private readonly IUserHelper userHelper;
        private readonly Operations operations = new();
        private readonly string username = "";

        public DepartmentsController(ILogger<DepartmentsController> logger, IUserHelper user)
        {
            _logger = logger;
            userHelper = user;
            username = userHelper.GetUserName();
        }

        [HttpGet("names")]
        public IActionResult DepartmenstName()
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

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
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
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
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            Department department = new();
            try
            {
                department = new()
                {
                    Dept = form["dept"].ToString(),
                    Enabled = bool.Parse(form["enabled"].ToString()),
                    Extensions = new(),
                    LocalPath = form["localPath"].ToString(),
                    NetPath = form["netPath"].ToString(),
                    Note = form["note"]
                };
                operations.AddDepartment(department);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add department: {form["dept"].ToString()}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.Department),
                    EnumHelper.GetActionName(ActionEnum.Add),
                    JsonConvert.SerializeObject(new { }),
                    JsonConvert.SerializeObject(department)
                );
                return Ok(operations.GetDepartmentNames());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to write log");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("update/{dept}")]
        public ActionResult Put(string dept, [FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            Department oldDept = new();
            Department newDept =new();
            try
            {
                oldDept = operations.GetDepartment(dept);
                newDept = new()
                {
                    Dept = form["dept"].ToString(),
                    Enabled = bool.Parse(form["enabled"].ToString()),
                    Extensions = new(),
                    LocalPath = form["localPath"].ToString(),
                    NetPath = form["netPath"].ToString(),
                    Note = form["note"]
                };
                operations.UpdateDepartment(dept, newDept);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to update department: {dept}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.Department),
                    EnumHelper.GetActionName(ActionEnum.Update),
                    JsonConvert.SerializeObject(oldDept),
                    JsonConvert.SerializeObject(newDept)
                );
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to write log");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("delete/{dept}")]
        public IActionResult Delete(string dept)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            Department oldDept = new();
            try
            {
                oldDept = operations.GetDepartment(dept);
                operations.DeleteDepartment(dept);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to delete department: {dept}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.Department),
                    EnumHelper.GetActionName(ActionEnum.Delete),
                    JsonConvert.SerializeObject(oldDept),
                    JsonConvert.SerializeObject(new {})
                );
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to write log");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
