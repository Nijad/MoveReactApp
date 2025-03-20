using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.VisualBasic;
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
    public class ExtDeptController : ControllerBase
    {
        private readonly ILogger<ExtDeptController> _logger;
        private readonly IUserHelper userHelper;
        private readonly Operations operations = new();
        private readonly string username = "";

        public ExtDeptController(ILogger<ExtDeptController> logger, IUserHelper user)
        {
            _logger = logger;
            userHelper = user;
            username = userHelper.GetUserName();
        }

        [HttpPost("{from}")]
        public IActionResult Post(string from, [FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            if (from != "ext" && from != "dept")
            {
                _logger.LogError("from parameter is neither 'ext' nor 'dept'.");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
            string ext = "";
            string department = "";

            ExtensionDepts extensionDepts = new();
            try
            {
                double id = double.Parse(form["id"].ToString());
                ext = form["ext"].ToString();
                department = form["department"].ToString();
                string direction = form["direction"].ToString();
                extensionDepts = new()
                {
                    Department = department,
                    Direction = direction,
                    Ext = ext,
                    Id = id
                };

                operations.AddExtDept(extensionDepts);
            }
            catch (Exception ex)
            {
                string msg = $"Failed mapping extension '{ext}' and department '{department}'";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.DepartmentExtensions),
                    EnumHelper.GetActionName(ActionEnum.Add),
                    JsonConvert.SerializeObject(new { }),
                    JsonConvert.SerializeObject(extensionDepts)
                );
            }
            catch (Exception ex)
            {
                string msg = $"Failed to write log";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }

            if (from == "ext")
                return Ok(operations.GetExtDepartments(ext));
            else
                return Ok(operations.GetDeptExtensions(department));
        }

        [HttpPost("Update")]
        public IActionResult Put(IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            string ext = "";
            string dept = "";
            string direction = "";

            ExtensionDepts newExtDept = new();
            ExtensionDepts oldExtDept = new();

            try
            {
                ext = form["ext"].ToString();
                dept = form["dept"].ToString();
                direction = form["direction"].ToString();
                oldExtDept = operations.GetExtDept(ext, dept);
                newExtDept = new()
                {
                    Ext = ext,
                    Department = dept,
                    Direction = direction
                };

                operations.UpdateDeptExt(newExtDept);
            }
            catch (Exception ex)
            {
                string msg = $"Failed updating extension '{ext}' and department '{dept}'";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.DepartmentExtensions),
                    EnumHelper.GetActionName(ActionEnum.Update),
                    JsonConvert.SerializeObject(oldExtDept),
                    JsonConvert.SerializeObject(newExtDept)
                );
            }
            catch (Exception ex)
            {
                string msg = "Failed to write log";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new {  msg });
            }
            return Ok();
        }

        [HttpPost("Delete")]
        public IActionResult Delete([FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            ExtensionDepts extDepts = new();
            try
            {
                string ext = form["ext"].ToString();
                string dept = form["dept"].ToString();
                extDepts = new()
                {
                    Ext = ext,
                    Department = dept
                };
                operations.DeleteExtDept(extDepts);
            }
            catch (Exception ex)
            {
                string msg = $"Failed unmapping extension '{extDepts.Ext}' and department '{extDepts.Department}'";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.DepartmentExtensions),
                    EnumHelper.GetActionName(ActionEnum.Delete),
                    JsonConvert.SerializeObject(extDepts),
                    JsonConvert.SerializeObject(new { })
                );
            }
            catch (Exception ex)
            {
                string msg = $"Failed to write log";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }

            return Ok();
        }
    }
}
