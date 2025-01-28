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
        List<Extension> extensions = new()
            {
                new Extension()
                {
                    Ext="doc",
                    Program="Word",
                    Note="",
                    Enabled=true,
                    Departments=new List<ExtensionDepts>()
                    {
                        new ExtensionDepts()
                        {
                            Department="IT",
                            Direction=3
                        },
                        new ExtensionDepts()
                        {
                            Department="RISK",
                            Direction=3
                        },
                        new ExtensionDepts()
                        {
                            Department="AUDIT",
                            Direction=2
                        },
                        new ExtensionDepts()
                        {
                            Department="CREDIT",
                            Direction=1
                        },
                        new ExtensionDepts()
                        {
                            Department="RETAIL",
                            Direction=1
                        }
                    }
                },
                new Extension()
                {
                    Ext="docx",
                    Program="Word",
                    Note="",
                    Enabled=true,
                    Departments=new List<ExtensionDepts>()
                    {
                        new ExtensionDepts()
                        {
                            Department="IT",
                            Direction=2
                        },
                        new ExtensionDepts()
                        {
                            Department="RISK",
                            Direction=1
                        },
                        new ExtensionDepts()
                        {
                            Department="AUDIT",
                            Direction=1
                        },
                        new ExtensionDepts()
                        {
                            Department="CREDIT",
                            Direction=1
                        },
                        new ExtensionDepts()
                        {
                            Department="RETAIL",
                            Direction=3
                        }
                    }
                },
                new Extension()
                {
                    Ext="xls",
                    Program="Excel",
                    Note="",
                    Enabled=false,
                    Departments=new List<ExtensionDepts>()
                    {
                        new ExtensionDepts()
                        {
                            Department="IT",
                            Direction=1
                        },
                        new ExtensionDepts()
                        {
                            Department="RISK",
                            Direction=2
                        },
                        new ExtensionDepts()
                        {
                            Department="AUDIT",
                            Direction=3
                        },
                        new ExtensionDepts()
                        {
                            Department="CREDIT",
                            Direction=3
                        },
                        new ExtensionDepts()
                        {
                            Department="RETAIL",
                            Direction=2
                        }
                    }
                },
                new Extension()
                {
                    Ext="xlsx",
                    Program="Excel",
                    Note="",
                    Enabled=true,
                    Departments=new List<ExtensionDepts>()
                    {
                        new ExtensionDepts()
                        {
                            Department="IT",
                            Direction=3
                        },
                        new ExtensionDepts()
                        {
                            Department="RISK",
                            Direction=2
                        },
                        new ExtensionDepts()
                        {
                            Department="AUDIT",
                            Direction=2
                        },
                        new ExtensionDepts()
                        {
                            Department="CREDIT",
                            Direction=2
                        },
                        new ExtensionDepts()
                        {
                            Department="RETAIL",
                            Direction=3
                        }
                    }
                },
            };
        // GET: api/<ExtensionController>
        [HttpGet]
        public List<Extension> Get()
        {
            //List<Extension> extensions = Operations.GetExtensions();
            return extensions;
        }

        [HttpGet("names")]
        public string[] ExtensionstName()
        {
            return extensions.Select(x => x.Ext).ToArray();
        }

        //[HttpGet("GetExtensions")]
        //public ActionResult GetExtensions()
        //{
        //    return Ok(new { data = extensions, cols = columnDefenitions });
        //}

        // GET api/<ExtensionController>/5
        //[HttpGet("{ext}")]
        //public List<ExtensionDepts> Get(string ext)
        //{
        //    var s = Operations.GetExtDepartments(ext);
        //    return s;
        //}

        [HttpGet("{ext}")]
        public Extension Get(string ext)
        {
            Extension? s = extensions.Where(X => X.Ext == ext).FirstOrDefault();
            return s;
        }

        // POST api/<ExtensionController>
        [HttpPost]
        public List<Extension> Post([FromBody] Extension extension)
        {
            extensions.Add(extension);
            return extensions;

            Operations.AddExtension(extension);
            return Operations.GetExtensions();
        }

        // PUT api/<ExtensionController>/5
        [HttpPut("{ext}")]
        public List<Extension> Put(string ext, [FromBody] Extension extension)
        {
            extensions.Find(x => x.Ext == extension.Ext).Note=extension.Note;
            return extensions;
            Operations.UpdateExtension(ext, extension);
            return Operations.GetExtensions();
        }

        // DELETE api/<ExtensionController>/5
        [HttpDelete("{ext}")]
        public void Delete(string ext)
        {
            return;
            Operations.DeleteExtension(ext);
        }
    }
}
