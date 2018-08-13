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
    public class PositionController : Controller
    {
        private readonly EmployeeDBContext _employeeContext;

        public PositionController(EmployeeDBContext employeeContext)
        {
            _employeeContext = employeeContext;
        }

        [Route("getpositions")]
        [HttpGet]
        public IActionResult GetPositions()
        {
            return Ok(_employeeContext.Position.OrderByDescending(o => o.CreateDate));
        }

        [Route("getposition/{id}")]
        [HttpGet]
        public IActionResult GetPosition(Guid id)
        {
            Position position = _employeeContext.Position.Find(id);
            if (position == null)
            {
                return NotFound();
            }

            return Ok(position);
        }

        [Route("updateposition/{id}")]
        [HttpPut]
        public IActionResult UpdatePosition(Guid id, Position position)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            if (id != position.Guid)
            {
                return BadRequest();
            }

            position.UpdateDate = DateTime.Now;
            _employeeContext.Entry(position).State = EntityState.Modified;

            try
            {
                _employeeContext.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                if (!PositionExists(id))
                {
                    return StatusCode((int)HttpStatusCode.NotFound, ex.Message);
                }
                else
                {
                    throw;
                }
            }

            return Ok(0);
        }

        [Route("createposition")]
        [HttpPost]
        public IActionResult CreatePosition(Position position)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            position.Guid = Guid.NewGuid();
            position.CreateDate = DateTime.Now;
            _employeeContext.Position.Add(position);

            try
            {
                _employeeContext.SaveChanges();
            }
            catch (DbUpdateException ex)
            {
                if (PositionExists(position.Guid))
                {
                    return StatusCode((int)HttpStatusCode.Conflict, ex.Message);
                }
                else
                {
                    throw;
                }
            }

            return Ok(position);
        }

        [Route("deleteposition")]
        [HttpDelete]
        public IActionResult DeletePosition(Guid id)
        {
            Position position = _employeeContext.Position.Find(id);
            if (position == null)
            {
                return NotFound();
            }

            _employeeContext.Position.Remove(position);
            _employeeContext.SaveChanges();

            return Ok(0);
        }

        private bool PositionExists(Guid id)
        {
            return _employeeContext.Position.Count(e => e.Guid == id) > 0;
        }
    }
}
