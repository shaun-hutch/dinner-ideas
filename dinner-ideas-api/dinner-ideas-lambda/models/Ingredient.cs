namespace dinner_ideas_lambda.models;

public class Ingredient
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = "";
    public Measurement Measurement { get; set; }
    public decimal Amount { get; set; }
    /// <summary>Optional free-form quantity for non-numeric measurements (e.g., "to taste", "1 can", "a pinch").</summary>
    public string? Quantity { get; set; }
    /// <summary>Optional reference to the step this ingredient is used in. Null = unassigned.</summary>
    public Guid? StepId { get; set; }
}
