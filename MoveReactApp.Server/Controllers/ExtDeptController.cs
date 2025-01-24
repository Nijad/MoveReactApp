using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.DTO;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtDeptController : ControllerBase
    {
        // GET: api/<ExtDeptController>
        [HttpGet("ExtDepts/{ext}")]
        public IEnumerable<ExtensionDepts> Get(string ext)
        {
            List<ExtensionDepts> extensionDepts = new()
            {
                new ExtensionDepts()
                {
                    Id=1,
                    Department="IT",
                    Direction=3,
                    Enabled=true,
                    LocalPath="path to local",
                    NetPath="net to path",
                    Note="Note 1"
                },
                new ExtensionDepts()
                {
                    Id=2,
                    Department="RISK",
                    Direction=3,
                    Enabled=true,
                    LocalPath="path to local",
                    NetPath="net to path",
                    Note="Note 1"
                }
            };
            return extensionDepts;
        }

        // GET api/<ExtDeptController>/5
        [HttpGet("{id}")]
        public string Get(int id)
        {
            return "value";
        }

        // POST api/<ExtDeptController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ExtDeptController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ExtDeptController>/5
        [HttpDelete("{ext}/{dept}")]
        public void Delete(string ext, string dept)
        {
        }
    }
}
