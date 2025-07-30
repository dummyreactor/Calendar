namespace Calendar.Models
{
    public class NewTaskInputModel
    {
        public string Title { get; set; }
        public string Description { get; set; }

        public int Hour { get; set; }    // new
        public int Minute { get; set; }  // new

        // Optional: convenience property
        public TimeSpan Duration => TimeSpan.FromHours(Hour) + TimeSpan.FromMinutes(Minute);
    }
}
