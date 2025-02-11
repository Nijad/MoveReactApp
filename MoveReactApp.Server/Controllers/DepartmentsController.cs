﻿using Microsoft.AspNetCore.Mvc;
using MoveReactApp.Server.Database;
using MoveReactApp.Server.Models;

// For more information on enabling Web API for empty projects, visit https://go.microsoft.com/fwlink/?LinkID=397860

namespace MoveReactApp.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class DepartmentsController : ControllerBase
    {
        Operations operations = new();
        // GET: api/<Departments>
        [HttpGet]
        public IEnumerable<Department> Get()
        {
            return operations.GetDepartments();
        }

        [HttpGet("names")]
        public string[] DepartmenstName()
        {
            return operations.GetDepartmentNames();
            
        }

        // GET api/<Departments>/5
        [HttpGet("{dept}")]
        public Department Get(string dept)
        {
            return operations.GetDepartment(dept);
        }

        // POST api/<Departments>
        [HttpPost]
        public void Post([FromBody] string value)
        {
        }

        // PUT api/<Departments>/5
        [HttpPut("{id}")]
        public void Put(int id, [FromBody] string value)
        {
        }

        // DELETE api/<Departments>/5
        [HttpDelete("{id}")]
        public void Delete(int id)
        {
        }
    }
}
