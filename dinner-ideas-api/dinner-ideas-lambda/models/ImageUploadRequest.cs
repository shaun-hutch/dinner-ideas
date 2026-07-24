namespace dinner_ideas_lambda.models;

public class ImageUploadRequest
{
    public required string FileName { get; set; }
    public required string ContentType { get; set; }
    public required string DinnerItemId { get; set; }
}

public class ImageUploadResponse
{
    public required string UploadUrl { get; set; }
    public required string ImageKey { get; set; }
    public required string ImageUrl { get; set; }
}
