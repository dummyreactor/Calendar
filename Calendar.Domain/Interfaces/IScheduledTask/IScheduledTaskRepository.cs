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

        Task<bool> DeleteTaskAsync(int taskId);

        Task<List<NewTask>> GetAllTasksAsync();

        Task<List<ScheduledTask>> GetAllScheduledTasksAsync();

        Task DeleteScheduledTaskAsync(int taskId);

        Task DeleteNewTaskAsync(int taskId);

        Task UpdateTaskAsync(NewTask task);

        Task<ScheduledTask?> GetScheduledTaskByIdAsync(int taskId);

        Task UpdateScheduledAsync(ScheduledTask task);
    }
}
