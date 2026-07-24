namespace dinner_ideas_lambda.models;

public class Ingredient
{
    public required Guid Id { get; set; }
    public required string Name { get; set; }
    public string Description { get; set; } = "";
    public Measurement Measurement { get; set; }
    public decimal Amount { get; set; }
}
