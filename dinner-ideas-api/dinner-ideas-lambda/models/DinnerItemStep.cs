namespace dinner_ideas_lambda.models;

public class DinnerItemStep
{
    public required string StepTitle { get; set; }
    public required string StepDescription { get; set; }
    public required Guid Id { get; set; }
}