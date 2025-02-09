using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtensionsController : ControllerBase
    {
        Operations operations = new();
        // GET: api/<ExtensionController>
        [HttpGet]
        public List<Extension> Get()
        {
            return operations.GetExtensions();
        }

        [HttpGet("names")]
        public string[] ExtensiontNames()
        {
            return operations.GetExtensionNames();
        }

        [HttpGet("{ext}")]
        public Extension Get(string ext)
        {
            Extension? s = operations.GetExtension(ext);
            //Extension? s = extensions.Where(X => X.Ext == ext).FirstOrDefault();
            return s;
        }

        // POST api/<ExtensionController>
        [HttpPost]
        public string[] Post([FromBody] Extension extension)
        {
            //List<Extension> s = FakeData.Extensions();
            //s.Add(extension);
            //return s.Select(x => x.Ext).ToArray();

            operations.AddExtension(extension);
            return ExtensiontNames();
        }

        // PUT api/<ExtensionController>/5
        [HttpPut("{ext}")]
        public List<Extension> Put(string ext, [FromBody] Extension extension)
        {
            operations.UpdateExtension(ext, extension);
            return operations.GetExtensions();
        }

        // DELETE api/<ExtensionController>/5
        [HttpDelete("{ext}")]
        public void Delete(string ext)
        {
            //return;
            operations.DeleteExtension(ext);
        }
    }
}
