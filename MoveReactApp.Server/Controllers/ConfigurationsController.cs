using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Helper;
using MoveReactApp.Server.Models.DTOs;
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
                string msg = "Failed to get configurations";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }
        }

        [HttpPost]
        public IActionResult Put([FromForm] IFormCollection form)
        {
            if (string.IsNullOrEmpty(username))
                return Unauthorized("User is not authenticated.");

            UpdateConfigDTO oldConfig = new();
            UpdateConfigDTO newConfig = new();
            try
            {
                newConfig.Key = form["key"].ToString();
                newConfig.Value = form["value"].ToString();
                oldConfig = operations.GetConfig(newConfig.Key);
                operations.UpdateConfig(newConfig);
            }
            catch (Exception ex)
            {
                string msg = $"Failed to update {newConfig.Key}";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }

            try
            {
                operations.WriteLog(
                    username, 
                    EnumHelper.GetTableName(TableEnum.Configurations), 
                    EnumHelper.GetActionName(ActionEnum.Update),
                    JsonConvert.SerializeObject(new { oldConfig.Key, oldConfig.Value }),
                    JsonConvert.SerializeObject(newConfig));
                return Ok();
            }
            catch (Exception ex)
            {
                string msg = $"Failed to write log";
                _logger.LogError(ex, msg);
                return StatusCode((int)HttpStatusCode.InternalServerError, new { msg });
            }
        }
    }
}
