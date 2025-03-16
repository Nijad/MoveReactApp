using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    [Authorize(Roles = "INTERNET\\Domain Users")]
    public class ExtDeptController : ControllerBase
    {
        Operations operations = new();

        // POST api/<ExtDeptController>
        [HttpPost("{from}")]
        public IEnumerable<ExtensionDepts> Post(string from, [FromForm] IFormCollection form)
        {
            double id = double.Parse(form["id"]);
            string ext = form["ext"];
            string department = form["department"];
            string direction = form["direction"];

            operations.AddExtDept(new ExtensionDepts
            {
                Department = department,
                Direction = direction,
                Ext = ext,
                Id = id
            });
            if (from == "ext")
                return operations.GetExtDepartments(ext);

            if (from == "dept")
                return operations.GetDeptExtensions(department);

            return new List<ExtensionDepts>();
        }

        //PUT api/<ExtDeptController>/5
        [HttpPost("Update")]
        public List<ExtensionDepts> Put(IFormCollection form)
        {
            string ext = form["ext"];
            string dept = form["dept"];
            string direction = form["direction"];
            string from = form["from"];
            operations.UpdateDeptExt(ext, dept, direction);

            if (from == "ext")
                return operations.GetExtDepartments(ext);

            if (from == "dept")
                return operations.GetDeptExtensions(dept);

            return new List<ExtensionDepts>();
        }

        // DELETE api/<ExtDeptController>/5
        [HttpPost("Delete")]
        public IEnumerable<ExtensionDepts> Delete([FromForm] IFormCollection form)
        {
            string ext = form["ext"];
            string dept = form["dept"];
            operations.DeleteExtDept(ext, dept);
            return operations.GetExtDepartments(ext);
        }
    }
}
