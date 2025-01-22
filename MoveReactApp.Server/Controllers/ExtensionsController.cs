using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.DTO;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtensionsController : ControllerBase
    {
        // GET: api/<ExtensionController>
        [HttpGet]
        public List<Extension> Get()
        {
            //List<Prop> columnDefenitions = ColDef.Properties<Extension>(new Extension());
            //List<Extension> extensions = new()
            //{
            //    new Extension()
            //    {
            //        Id=1,
            //        Ext="doc",
            //        Program="Word",
            //        Note="",
            //        Enabled=true
            //    },
            //    new Extension()
            //    {
            //        Id=2,
            //        Ext="docx",
            //        Program="Word",
            //        Note="",
            //        Enabled=true
            //    },
            //    new Extension()
            //    {
            //        Id=3,
            //        Ext="xls",
            //        Program="Excel",
            //        Note="",
            //        Enabled=false
            //    },
            //    new Extension()
            //    {
            //        Id=4,
            //        Ext="xlsx",
            //        Program="Excel",
            //        Note="",
            //        Enabled=true
            //    },
            //};

            List<Extension> extensions = Operations.GetExtensions();
            return extensions;
        }

        //[HttpGet("GetExtensions")]
        //public ActionResult GetExtensions()
        //{
        //    List<Prop> columnDefenitions = ColDef.Properties<Extension>(new Extension());
        //    List<Extension> extensions = new()
        //    {
        //        new Extension()
        //        {
        //            Ext="doc",
        //            Program="Word",
        //            Note="",
        //            Enabled=true
        //        },
        //        new Extension()
        //        {
        //            Ext="docx",
        //            Program="Word",
        //            Note="",
        //            Enabled=true
        //        },
        //        new Extension()
        //        {
        //            Ext="xls",
        //            Program="Excel",
        //            Note="",
        //            Enabled=true
        //        },
        //        new Extension()
        //        {
        //            Ext="xlsx",
        //            Program="Excel",
        //            Note="",
        //            Enabled=true
        //        },
        //    };
        //    return Ok(new { data = extensions, cols = columnDefenitions });
        //}

        // GET api/<ExtensionController>/5
        [HttpGet("{ext}")]
        public List<ExtensionDepts> Get(string ext)
        {
            var s = Operations.GetExtDepartments(ext);
            return s;
        }

        // POST api/<ExtensionController>
        [HttpPost]
        public void Post([FromBody] Extension extension)
        {
            Operations.AddExtension(extension);
        }

        // PUT api/<ExtensionController>/5
        [HttpPut("{ext}")]
        public void Put(string ext, [FromBody] Extension extension)
        {
            Operations.UpdateExtension(ext, extension);
        }

        // DELETE api/<ExtensionController>/5
        [HttpDelete("{ext}")]
        public void Delete(string ext)
        {
            Operations.DeleteExtension(ext);
        }
    }
}
