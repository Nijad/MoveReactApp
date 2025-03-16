using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize]
    public class ConfigurationsController : ControllerBase
    {
        Operations operations = new();
        // GET: api/<ConfigurationsController>
        [HttpGet]
        public IEnumerable<Configuration> Get()
        {
            return operations.GetConfig();
        }

        // PUT api/<ConfigurationsController>/5
        [HttpPost]
        public void Put([FromForm] IFormCollection form)
        {
            UpdateConfigDTO value = new()
            {
                Key = form["key"].ToString(),
                Value = form["value"].ToString(),
            };
            operations.UpdateConfig(value);
        }
    }
}
