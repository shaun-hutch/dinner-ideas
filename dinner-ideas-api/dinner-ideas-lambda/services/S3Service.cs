using Amazon;
using Amazon.Lambda.Core;
using Amazon.S3;
using Amazon.S3.Model;

namespace dinner_ideas_lambda.services;

public interface IS3Service
{
    string GenerateUploadUrl(string key, string contentType, TimeSpan expiry);
    string GetImageUrl(string key);
}

public class S3Service : IS3Service
{
    private readonly IAmazonS3 _s3Client;
    private readonly string _bucketName;

    public S3Service()
    {
        var region = Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-west-1";
        _s3Client = new AmazonS3Client(RegionEndpoint.GetBySystemName(region));
        _bucketName = Environment.GetEnvironmentVariable("IMAGE_BUCKET_NAME") ?? "dinner-ideas-images";
    }

    public string GenerateUploadUrl(string key, string contentType, TimeSpan expiry)
    {
        var request = new GetPreSignedUrlRequest
        {
            BucketName = _bucketName,
            Key = key,
            Verb = HttpVerb.PUT,
            Expires = DateTime.UtcNow.Add(expiry),
            ContentType = contentType
        };

        return _s3Client.GetPreSignedURL(request);
    }

    public string GetImageUrl(string key)
    {
        var region = Environment.GetEnvironmentVariable("AWS_REGION") ?? "us-west-1";
        return $"https://{_bucketName}.s3.{region}.amazonaws.com/{key}";
    }
}
