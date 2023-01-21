namespace DinnerIdeas;

public class DinnerPayload 
{
    public PayloadType Type { get; }
    public FoodItem? FoodItem { get; } = null;
    public WeekItem? WeekItem { get; } = null;
}

public class FoodItem 
{
    public Guid Id { get; set; }
    public string? Name { get; set; }
    public string? ImageBase64 { get; set; }
}

public class WeekItem
{
    public Guid Id { get; set; }
    public DateTime? StartDate { get; set; }
    public DateTime? EndDate { get; set; } 
}

public enum PayloadType
{
    Read,
    Create,
    Update,
    Delete
}