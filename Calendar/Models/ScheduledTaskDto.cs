namespace Calendar.Models
{
    public class ScheduledTaskDto
    {
        public int TaskId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; }
        public DateTime ScheduledDate { get; set; }
    }
}
