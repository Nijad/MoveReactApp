using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtDeptController : ControllerBase
    {
        Operations operations = new();

        List<ExtensionDepts> extensionDepts = new()
        {
            new ExtensionDepts()
            {
                Ext="doc",
                Department="IT",
                Direction="IN/OUT",
            },
            new ExtensionDepts()
            {
                Ext="docx",
                Department="RISK",
                Direction="IN/OUT",
            }
        };

        // GET: api/<ExtDeptController>
        [HttpGet("ExtDepts/{ext}")]
        public IEnumerable<ExtensionDepts> Get(string ext)
        {
            return extensionDepts;
        }

        // GET api/<ExtDeptController>/5
        //[HttpGet("{id}")]
        //public string Get(int id)
        //{
        //    return "value";
        //}

        // POST api/<ExtDeptController>
        [HttpPost("{from}")]
        public IEnumerable<ExtensionDepts> Post(string from, [FromBody] ExtensionDepts extensionDepts)
        {
            //extensionDepts.Add(new ExtensionDepts()
            //{
            //    Ext = extensionDepts.Ext,
            //    Department = extensionDepts.Department,
            //    Direction = extensionDepts.Direction,
            //});
            //return extensionDepts;
            operations.AddExtDept(extensionDepts);
            if (from == "ext")
                return operations.GetExtDepartments(extensionDepts.Ext);

            if (from == "dept")
                return operations.GetDeptExtensions(extensionDepts.Department);

            return new List<ExtensionDepts>();
        }

        //PUT api/<ExtDeptController>/5
        [HttpPut("{ext}/{dept}/{direction}/{from}")]
        public void Put(string ext, string dept, string direction, string from)
        {
        }

        // DELETE api/<ExtDeptController>/5
        [HttpDelete("{ext}/{dept}")]
        public IEnumerable<ExtensionDepts> Delete(string ext, string dept)
        {
            operations.DeleteExtDept(ext, dept);
            return operations.GetExtDepartments(ext);
        }
    }
}
