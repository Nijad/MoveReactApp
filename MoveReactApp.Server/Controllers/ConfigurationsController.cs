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
    public class ConfigurationsController : ControllerBase
    {
        private readonly ILogger<ConfigurationsController> _logger;
        private readonly IUserHelper userHelper;
        private readonly Operations operations = new();
        private readonly string username = "";
        public ConfigurationsController(ILogger<ConfigurationsController> logger, IUserHelper user)
        {
            _logger = logger;
            userHelper = user;
            username = userHelper.GetUserName();
        }

        [HttpGet]
        public IActionResult Get()
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            try
            {
                return Ok(operations.GetConfig());
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, "Failed to get configurations");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        [HttpPost]
        public IActionResult Put([FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            string oldValue = "";
            UpdateConfigDTO keyValuePair = new();
            try
            {
                keyValuePair.Key = form["key"].ToString();
                keyValuePair.Value = form["value"].ToString();
                oldValue = operations.GetConfig(keyValuePair.Key);
                operations.UpdateConfig(keyValuePair);
            }
            catch (Exception ex)
            {
                _logger.LogError(ex, $"Failed to update {keyValuePair.Key}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }

            try
            {
                operations.WriteLog(
                    username, 
                    EnumHelper.GetTableName(TableEnum.Configurations), 
                    EnumHelper.GetActionName(ActionEnum.Update),
                    JsonConvert.SerializeObject(new { keyValuePair.Key, oldValue }),
                    JsonConvert.SerializeObject(new { keyValuePair.Key, keyValuePair.Value }));
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
