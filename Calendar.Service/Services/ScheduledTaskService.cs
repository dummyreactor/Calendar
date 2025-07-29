using Calendar.Domain.Interfaces.IScheduledTask;
using Calendar.Domain.Models;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.Service.Services
{
    public class ScheduledTaskService : IScheduledTaskService
    {
        private readonly IScheduledTaskRepository _taskRepository;

        public ScheduledTaskService(IScheduledTaskRepository taskRepository)
        {
            _taskRepository = taskRepository;
        }

        public async Task<List<ScheduledTask>> GetWeeklyTasksAsync(DateTime startOfWeek)
        {
            return await _taskRepository.GetTasksForWeekAsync(startOfWeek);
        }

    

        public async Task AddTaskAsync(NewTask task)
        {
            await _taskRepository.AddTaskAsync(task);
        }

        public async Task AddScheduledAsync(ScheduledTask task)
        {
            await _taskRepository.AddScheduledAsync(task);
        }

        public async Task<NewTask> GetTaskByIdAsync(int taskId)
        {
            return await _taskRepository.GetTaskByIdAsync(taskId);
        }

        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            return await _taskRepository.DeleteTaskAsync(taskId);
        }
    }
}
