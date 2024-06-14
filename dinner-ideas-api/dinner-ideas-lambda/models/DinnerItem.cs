namespace dinner_ideas_lambda.models;

public class DinnerItem : BaseItem
{
    public override string TypeAndId { get => $"{nameof(DinnerItem)}|{Id}|{CreatedBy}"; }
    public required string Name { get; set; }
    public required string Description { get; set; }
    public required int PrepTime { get; set; }
    public required int CookTime { get; set; }
    public Dictionary<string, string> Steps { get; set; } = [];
    public FoodTag[] Tags { get; set; } = [];
    public int TotalTime => PrepTime + CookTime;

}