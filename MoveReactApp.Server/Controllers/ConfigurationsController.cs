using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;
using System.Net;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConfigurationsController : ControllerBase
    {
        private readonly ILogger<MoveController> _logger;

        public ConfigurationsController(ILogger<MoveController> logger)
        {
            _logger = logger;
        }

        Operations operations = new();
        // GET: api/<ConfigurationsController>
        [HttpGet]
        public IActionResult Get()
        {
            try
            {
                return Ok(operations.GetConfig());
            }catch(Exception ex)
            {
                _logger.LogError(ex, "Failed to get configurations");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }

        // PUT api/<ConfigurationsController>/5
        [HttpPost]
        public IActionResult Put([FromForm] IFormCollection form)
        {
            UpdateConfigDTO keyValuePair = new()
            {
                Key = form["key"].ToString(),
                Value = form["value"].ToString(),
            };
            try
            {
                operations.UpdateConfig(keyValuePair);
                return Ok();
            }catch(Exception ex)
            {
                _logger.LogError(ex, $"Failed to update {keyValuePair.Key}");
                return StatusCode((int)HttpStatusCode.InternalServerError);
            }
        }
    }
}
