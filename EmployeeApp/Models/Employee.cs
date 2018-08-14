using System;
using System.Collections.Generic;

namespace EmployeeApp.Models
{
    public partial class Employee
    {
        public Guid Guid { get; set; }
        public string FullName { get; set; }
        public Guid PositionGuid { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }

        public Position Position { get; set; }
    }
}
