using Calendar.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.Domain.Interfaces.IScheduledTask
{
    public interface IScheduledTaskRepository
    {
        Task<List<ScheduledTask>> GetTasksForWeekAsync(DateTime startOfWeek);

        Task AddTaskAsync(NewTask task);

        Task AddScheduledAsync(ScheduledTask task);

        Task<NewTask> GetTaskByIdAsync(int taskId);

    }
}
