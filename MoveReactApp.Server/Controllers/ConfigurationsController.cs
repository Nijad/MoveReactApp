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

        // GET api/<ConfigurationsController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ConfigurationsController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ConfigurationsController>/5
        [HttpPut]
        public void Put([FromBody] UpdateConfigDTO value)
        {
            operations.UpdateConfig(value);
        }

        // DELETE api/<ConfigurationsController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
