using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class MoveController : ControllerBase
    {
        Operations operations = new();
        // GET: api/<MoveController>
        [HttpGet]
        public IEnumerable<string> Get()
        {
            List<Department> depts = operations.GetDepartments();
            return ["sd","df"];
        }

        // GET api/<MoveController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<MoveController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<MoveController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<MoveController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
