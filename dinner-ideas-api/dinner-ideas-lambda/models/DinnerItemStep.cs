namespace dinner_ideas_lambda.models;

public class DinnerItemStep
{
    public required string StepTitle { get; set; }
    public required string StepDescription { get; set; }
    public required Guid Id { get; set; }
    /// <summary>Denormalised list of ingredient IDs used in this step, for convenient frontend rendering.</summary>
    public List<Guid> IngredientIds { get; set; } = [];
}