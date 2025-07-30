namespace Calendar.Models
{
    public class TaskViewModel
    {
        public int TaskId { get; set; }
        public int? ScheduledTaskId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public TimeSpan Duration { get; set; }
    }
}
