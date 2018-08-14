using Newtonsoft.Json;
using System;
using System.Collections.Generic;

namespace EmployeeApp.Models
{
    public partial class Position
    {
        public Position()
        {
            Employee = new HashSet<Employee>();
        }

        public Guid Guid { get; set; }
        public string Name { get; set; }
        public DateTime CreateDate { get; set; }
        public DateTime? UpdateDate { get; set; }

        [JsonIgnore]
        public ICollection<Employee> Employee { get; set; }
    }
}
