namespace Calendar.Models
{
    public class NewTaskInputModel
    {
        public string Title { get; set; }
        public string Description { get; set; }
        public int Duration { get; set; } // In hours
    }
}
