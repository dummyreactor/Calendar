using Calendar.DataAccess.Database;
using Calendar.Domain.Interfaces.IScheduledTask;
using Calendar.Domain.Models;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Calendar.DataAccess.Repositories
{
    public class ScheduledTaskRepository : IScheduledTaskRepository
    {
        private readonly AppDbContext _context;

        public ScheduledTaskRepository(AppDbContext context)
        {
            _context = context;
        }

        public async Task<List<ScheduledTask>> GetTasksForWeekAsync(DateTime startOfWeek)
        {
            DateTime endOfWeek = startOfWeek.AddDays(7);
            return await _context.ScheduledTasks
                .Include(t => t.NewTask)
                .Where(t => t.ScheduledDate >= startOfWeek && t.ScheduledDate < endOfWeek)
                .ToListAsync();
        }

        public async Task AddTaskAsync(NewTask task)
        {
            _context.NewTasks.Add(task);
            await _context.SaveChangesAsync();
        }

        public async Task AddScheduledAsync(ScheduledTask task)
        {
            _context.ScheduledTasks.Add(task);
            await _context.SaveChangesAsync();
        }

        public async Task<NewTask> GetTaskByIdAsync(int taskId)
        {
            return await _context.NewTasks.FindAsync(taskId);
        }

        public async Task<bool> DeleteTaskAsync(int taskId)
        {
            var task = await _context.ScheduledTasks.FindAsync(taskId);
            if (task == null) return false;

            _context.ScheduledTasks.Remove(task);
            return await _context.SaveChangesAsync() > 0;
        }
    }
}
