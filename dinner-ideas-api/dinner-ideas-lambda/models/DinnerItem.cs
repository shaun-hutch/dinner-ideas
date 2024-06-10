namespace dinner_ideas_lambda.models;

public class DinnerItem : BaseItem
{
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required int PrepTime { get; set; }
    public required int CookTime { get; set; }
    public Dictionary<string, string> Steps { get; set; } = [];
    public FoodTag[] Tag { get; set; } = [];
    public int TotalTime => PrepTime + CookTime;

}