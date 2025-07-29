using Calendar.Domain.Interfaces.IScheduledTask;
using Calendar.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;

namespace Calendar.Controllers
{
    public class HomeController : Controller
    {
        private readonly IScheduledTaskService _taskService;

        public HomeController(IScheduledTaskService taskService)
        {
            _taskService = taskService;
        }

        public async Task<IActionResult> Index(string direction)
        {
            DateTime startOfWeek = HttpContext.Session.Get<DateTime>("StartOfWeek");
            if (startOfWeek == default)
            {
                DateTime today = DateTime.Today;
                int delta = DayOfWeek.Monday - today.DayOfWeek;
                startOfWeek = today.AddDays(delta);
            }

            switch (direction)
            {
                case "prev": startOfWeek = startOfWeek.AddDays(-7); break;
                case "next": startOfWeek = startOfWeek.AddDays(7); break;
                case "today":
                    DateTime today = DateTime.Today;
                    int delta = DayOfWeek.Monday - today.DayOfWeek;
                    startOfWeek = today.AddDays(delta);
                    break;
            }

            HttpContext.Session.Set("StartOfWeek", startOfWeek);

            var weekDates = Enumerable.Range(0, 7).Select(i => startOfWeek.AddDays(i)).ToList();
            var tasks = await _taskService.GetWeeklyTasksAsync(startOfWeek);

            ViewBag.WeekDates = weekDates;
            ViewBag.WeekRange = $"{weekDates[0]:dd MMM} – {weekDates[6]:dd MMM yyyy}";
            ViewBag.Tasks = tasks;

            return View();
        }
    }

    // Session helper methods
    public static class SessionExtensions
    {
        public static void Set<T>(this ISession session, string key, T value)
        {
            session.SetString(key, System.Text.Json.JsonSerializer.Serialize(value));
        }

        public static T Get<T>(this ISession session, string key)
        {
            var value = session.GetString(key);
            return value == null ? default : System.Text.Json.JsonSerializer.Deserialize<T>(value);
        }
    }
}
