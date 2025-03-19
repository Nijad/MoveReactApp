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
    public class ExtensionsController : ControllerBase
    {
        private readonly ILogger<ExtensionsController> _logger;
        private readonly IUserHelper userHelper;
        private readonly Operations operations = new();
        private readonly string username = "";

        public ExtensionsController(ILogger<ExtensionsController> logger, IUserHelper user)
        {
            _logger = logger;
            userHelper = user;
            username = userHelper.GetUserName();
        }

        [HttpGet("names")]
        public IActionResult ExtensiontNames()
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

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
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

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
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            Extension extension = new();
            try
            {
                extension = new()
                {
                    Ext = form["ext"].ToString(),
                    Enabled = bool.Parse(form["enabled"].ToString()),
                    Note = form["note"].ToString(),
                    Program = form["program"].ToString(),
                    Departments = new()
                };

                operations.AddExtension(extension);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add extension {form["ext"].ToString()}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.Extension),
                    EnumHelper.GetActionName(ActionEnum.Add),
                    JsonConvert.SerializeObject(new { }),
                    JsonConvert.SerializeObject(extension)
                );
                return Ok(ExtensiontNames());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to write log");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("update/{ext}")]
        public IActionResult Put(string ext, [FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            Extension newExtension = new();
            Extension oldExtension = new();
            try
            {
                oldExtension = operations.GetExtension(ext);
                newExtension = new()
                {
                    Ext = form["ext"].ToString(),
                    Enabled = bool.Parse(form["enabled"].ToString()),
                    Note = form["note"].ToString(),
                    Program = form["program"].ToString(),
                    Departments = new()
                };
                operations.UpdateExtension(ext, newExtension);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add extension {ext}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.Extension),
                    EnumHelper.GetActionName(ActionEnum.Update),
                    JsonConvert.SerializeObject(oldExtension),
                    JsonConvert.SerializeObject(newExtension)
                );
                return Ok();
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to write log");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost("delete/{ext}")]
        public IActionResult Delete(string ext)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");
            Extension oldExtension = new();
            try
            {
                oldExtension = operations.GetExtension(ext);
                operations.DeleteExtension(ext);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to add extension {ext}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username,
                    EnumHelper.GetTableName(TableEnum.Extension),
                    EnumHelper.GetActionName(ActionEnum.Delete),
                    JsonConvert.SerializeObject(oldExtension),
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
