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
    public class ExtDeptController : ControllerBase
    {
        Operations operations = new();

        // POST api/<ExtDeptController>
        [HttpPost("{from}")]
        public IEnumerable<ExtensionDepts> Post(string from, [FromBody] ExtensionDepts extensionDepts)
        {
            operations.AddExtDept(extensionDepts);
            if (from == "ext")
                return operations.GetExtDepartments(extensionDepts.Ext);

            if (from == "dept")
                return operations.GetDeptExtensions(extensionDepts.Department);

            return new List<ExtensionDepts>();
        }

        //PUT api/<ExtDeptController>/5
        [HttpPut("{ext}/{dept}/{direction}/{from}")]
        public List<ExtensionDepts> Put(string ext, string dept, string direction, string from)
        {
            operations.UpdateDeptExt(ext, dept, direction);

            if (from == "ext")
                return operations.GetExtDepartments(ext);

            if (from == "dept")
                return operations.GetDeptExtensions(dept);
            
            return new List<ExtensionDepts>();
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
