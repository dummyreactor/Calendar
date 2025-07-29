using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace Calendar.Domain.Models
{
    public class NewTask
    {
        [Key]
        public int TaskId { get; set; }

        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        public string Description { get; set; }

        public TimeSpan Duration { get; set; }

        // Navigation Property
        public ICollection<ScheduledTask> ScheduledTasks { get; set; }
    }
}
