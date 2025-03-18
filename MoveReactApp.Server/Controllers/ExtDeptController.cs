using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;
using System.Net;
using static System.Net.Mime.MediaTypeNames;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "INTERNET\\Domain Users")]
    public class ExtDeptController : ControllerBase
    {
        Operations operations = new();
        private readonly ILogger<DepartmentsController> _logger;

        public ExtDeptController(ILogger<DepartmentsController> logger)
        {
            _logger = logger;
        }

        [HttpPost("{from}")]
        public IActionResult Post(string from, [FromForm] IFormCollection form)
        {
            if (from != "ext" && from != "dept")
            {
                _logger.LogError("from parameter is neither 'ext' nor 'dept'.");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
            string ext = "";
            string department = "";
            try
            {
                double id = double.Parse(form["id"].ToString());
                ext = form["ext"].ToString();
                ext = form["department"].ToString();
                string direction = form["direction"].ToString();

                operations.AddExtDept(new ExtensionDepts
                {
                    Department = department,
                    Direction = direction,
                    Ext = ext,
                    Id = id
                });
                if (from == "ext")
                    return Ok(operations.GetExtDepartments(ext));
                else
                    return Ok(operations.GetDeptExtensions(department));

            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed mapping extension '{ext}' and department '{department}'");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("Update")]
        public IActionResult Put(IFormCollection form)
        {
            string ext = "";
            string dept = "";
            string direction = "";
            string from = "";
            try
            {
                from = form["from"].ToString();
                if (from != "ext" && from != "dept")
                {
                    _logger.LogError("from parameter is neither 'ext' nor 'dept'.");
                    return StatusCode((int)HttpStatusCode.InternalServerError);
                }
            }
            catch
            {
                _logger.LogError("from parameter is neither 'ext' nor 'dept'.");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                ext = form["ext"].ToString();
                dept = form["dept"].ToString();
                direction = form["direction"].ToString();
                operations.UpdateDeptExt(ext, dept, direction);

                if (from == "ext")
                    return Ok(operations.GetExtDepartments(ext));
                else
                    return Ok(operations.GetDeptExtensions(dept));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed updating extension '{ext}' and department '{dept}'");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("Delete")]
        public IActionResult Delete([FromForm] IFormCollection form)
        {
            string ext = "";
            string dept = "";
            try
            {
                ext = form["ext"].ToString();
                dept = form["dept"].ToString();
                operations.DeleteExtDept(ext, dept);
                return Ok(operations.GetExtDepartments(ext));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed unmapping extension '{ext}' and department '{dept}'");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
