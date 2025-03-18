using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;
using System.Net;

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ExtensionsController : ControllerBase
    {
        Operations operations = new();
        private readonly ILogger<DepartmentsController> _logger;

        public ExtensionsController(ILogger<DepartmentsController> logger)
        {
            _logger = logger;
        }

        ///////////////////////////////////////////
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(operations.GetExtensions());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get extensions");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }
        ///////////////////////////////////////////

        [HttpGet("names")]
        public IActionResult ExtensiontNames()
        {
            try
            {
                return Ok(operations.GetExtensionNames());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get extensions");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpGet("{ext}")]
        public IActionResult Get(string ext)
        {
            try
            {
                return Ok(operations.GetExtension(ext));
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get extensions");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost]
        public IActionResult Post([FromForm] IFormCollection form)
        {
            try
            {
                Extension extension = new()
                {
                    Ext = form["ext"].ToString(),
                    Enabled = bool.Parse(form["enabled"].ToString()),
                    Note = form["note"].ToString(),
                    Program = form["program"].ToString(),
                    Departments = new()
                };

                operations.AddExtension(extension);
                return Ok(ExtensiontNames());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add extension {form["ext"].ToString()}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("update/{ext}")]
        public IActionResult Put(string ext, [FromForm] IFormCollection form)
        {
            try
            {
                Extension extension = new()
                {
                    Ext = form["ext"].ToString(),
                    Enabled = bool.Parse(form["enabled"].ToString()),
                    Note = form["note"].ToString(),
                    Program = form["program"].ToString(),
                    Departments = new()
                };
                operations.UpdateExtension(ext, extension);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add extension {ext}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("delete/{ext}")]
        public IActionResult Delete(string ext)
        {
            try
            {
                operations.DeleteExtension(ext);
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add extension {ext}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
