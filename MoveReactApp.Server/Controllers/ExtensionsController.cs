using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.DTO;
using MoveReactApp.Server.Models;
using System.Reflection;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtensionsController : ControllerBase
    {
        // GET: api/<ExtensionController>
        [HttpGet]
        public IEnumerable<Extension> Get()
        {
            //ColDef colDef = new ColDef(typeof(Extension));
            //List<Prop> c = colDef.Properties;
            Extension e = new();
            List<Prop> c = ColDef.Properties<Extension>(e);
            return new List<Extension>()
            {
                new Extension()
                {
                    Ext="doc",
                    Program="Word",
                    Note="",
                    Enabled=true
                },
                new Extension()
                {
                    Ext="docx",
                    Program="Word",
                    Note="",
                    Enabled=true
                },
                new Extension()
                {
                    Ext="xls",
                    Program="Excel",
                    Note="",
                    Enabled=true
                },
                new Extension()
                {
                    Ext="xlsx",
                    Program="Excel",
                    Note="",
                    Enabled=true
                },
            };
            return Operations.GetExtensions();
        }

        // GET api/<ExtensionController>/5
        [HttpGet("{ext}")]
        public List<ExtensionDepts> Get(string ext)
        {
            var s = Operations.GetExtDepartments(ext);
            return s;
        }

        // POST api/<ExtensionController>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<ExtensionController>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<ExtensionController>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
