using EmployeeApp.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Linq;
using System.Net;

namespace EmployeeApp.Controllers
{
    [Route("api/[controller]")]
    [Produces("application/json")]
    public class EmployeeController : Controller
    {
        private readonly EmployeeDBContext _employeeContext;

        public EmployeeController(EmployeeDBContext employeeContext)
        {
            _employeeContext = employeeContext;
        }

        [Route("getemployees")]
        [HttpGet]
        public IActionResult GetEmployees()
        {
            return Ok(_employeeContext.Employee.OrderByDescending(o => o.CreateDate));
        }

        [Route("getemployee/{id}")]
        [HttpGet]
        public IActionResult GetEmployee(Guid id)
        {
            Employee employee = _employeeContext.Employee.Find(id);
            if (employee == null)
            {
                return NotFound();
            }

            return Ok(employee);
        }

        [Route("updateemployee/{id}")]
        [HttpPut]
        public IActionResult UpdateEmployee(Guid id, [FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != employee.Guid)
            {
                return BadRequest();
            }

            employee.UpdateDate = DateTime.Now;
            _employeeContext.Entry(employee).State = EntityState.Modified;

            try
            {
                _employeeContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!EmployeeExists(id))
                {
                    return StatusCode((int)HttpStatusCode.NotFound, ex.Message);
                }
                else
                {
					return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
				}
            }

            return Ok(0);
        }

        [Route("createemployee")]
        [HttpPost]
        public IActionResult CreateEmployee([FromBody] Employee employee)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            employee.Guid = Guid.NewGuid();
            employee.CreateDate = DateTime.Now;
            _employeeContext.Employee.Add(employee);

            try
            {
                _employeeContext.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                if (EmployeeExists(employee.Guid))
                {
                    return StatusCode((int)HttpStatusCode.Conflict, ex.Message);
                }
                else
                {
					return StatusCode((int)HttpStatusCode.InternalServerError, ex.Message);
				}
            }

            return Ok(employee);
        }

        [Route("deleteemployee/{id}")]
        [HttpDelete]
        public IActionResult DeleteEmployee(Guid id)
        {
            Employee employee = _employeeContext.Employee.Find(id);
            if (employee == null)
            {
                return NotFound();
            }

            _employeeContext.Employee.Remove(employee);
            _employeeContext.SaveChanges();

            return Ok(0);
        }

        private bool EmployeeExists(Guid id)
        {
            return _employeeContext.Employee.Count(e => e.Guid == id) > 0;
        }
    }
}
