using Calendar.DataAccess.Repositories;
using Calendar.Domain.Interfaces.IScheduledTask;
using Calendar.Domain.Models;
using Calendar.Models;
using Calendar.Service.Services;
using Microsoft.AspNetCore.Mvc;

namespace Calendar.Controllers
{
    public class TaskController : Controller
    {
        private readonly IScheduledTaskService _taskService;
        public TaskController(IScheduledTaskService taskService)
        {
            _taskService = taskService;
        }

        [HttpPost]
        public async Task<IActionResult> CreateNewTask([FromBody] NewTaskInputModel model)
        {
            if (string.IsNullOrWhiteSpace(model.Title) || model.Duration <= 0)
                return BadRequest("Invalid task data");

            // Create and save NewTask first
            var newTask = new NewTask
            {
                Title = model.Title,
                Description = model.Description
            };

            await _taskService.AddTaskAsync(newTask); // Save NewTask and get ID



            return Ok(new
            {
                message = "Task created successfully",
                taskId = newTask.TaskId
            });
        }

        [HttpPost]
        public async Task<IActionResult> Add([FromBody] ScheduledTaskDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Validate TaskId
            var existingTask = await _taskService.GetTaskByIdAsync(dto.TaskId);
            if (existingTask == null)
                return BadRequest("Task not found");

            //  Schedule the task using existing TaskId
            var scheduled = new ScheduledTask
            {
                TaskId = existingTask.TaskId,
                ScheduledDate = dto.ScheduledDate.Date,
                StartTime = dto.ScheduledDate.TimeOfDay,
                EndTime = dto.ScheduledDate.TimeOfDay + existingTask.Duration,
                DayOfWeek = dto.ScheduledDate.DayOfWeek.ToString()
            };

            await _taskService.AddScheduledAsync(scheduled);
            return Ok(new { message = "Scheduled successfully" });
        }

        [HttpDelete("/Task/Remove")]
        public async Task<IActionResult> Remove([FromQuery] int taskId)
        {
            var task = await _taskService.GetTaskByIdAsync(taskId);
            if (task == null)
                return NotFound("Task not found.");

            var deleted = await _taskService.DeleteTaskAsync(taskId);
            if (!deleted)
                return StatusCode(500, "Failed to delete the task.");

            return Ok(new { message = "Task deleted successfully." });
        }
    }
}
