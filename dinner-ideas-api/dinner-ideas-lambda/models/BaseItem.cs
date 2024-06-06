namespace dinner_ideas_lambda.models;

public class BaseItem
{
    public required Guid Id { get; set; }
    public required int CreatedBy { get; set; }
    public required int LastModifiedBy { get; set; }
    public required DateTime CreatedDate { get; set; }
    public required DateTime LastModifiedDate { get; set; }
    public required int Version { get; set; }
}