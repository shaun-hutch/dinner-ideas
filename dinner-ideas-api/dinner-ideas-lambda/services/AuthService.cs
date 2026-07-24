using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Amazon;
using dinner_ideas_lambda.models;
using Microsoft.IdentityModel.Tokens;

namespace dinner_ideas_lambda.services;

public interface IAuthService
{
    Task<AuthResponse> Register(string email, string password);
    Task<AuthResponse> Login(string email, string password);
    ClaimsPrincipal? ValidateToken(string token);
}

public class AuthService : IAuthService
{
    private readonly AmazonDynamoDBClient _dynamoDBClient;
    private readonly string _jwtSecret;
    private const string TABLE_NAME = Constants.TABLE_NAME;

    public AuthService()
    {
        _dynamoDBClient = new AmazonDynamoDBClient(RegionEndpoint.USWest1);
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET") ?? throw new InvalidOperationException("JWT_SECRET not configured");
    }

    public async Task<AuthResponse> Register(string email, string password)
    {
        // Check if user already exists
        var existingUser = await GetUserByEmail(email);
        if (existingUser != null)
            throw new InvalidOperationException("A user with this email already exists");

        // Hash password
        var salt = GenerateSalt();
        var passwordHash = HashPassword(password, salt);

        var userId = Guid.NewGuid();
        var user = new User
        {
            Id = userId,
            Email = email.ToLowerInvariant().Trim(),
            PasswordHash = passwordHash,
            Salt = salt,
            CreatedBy = 1,
            LastModifiedBy = 1,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow,
            Version = 1
        };

        var dict = new Dictionary<string, AttributeValue>
        {
            { Constants.ID_KEY, new AttributeValue { S = user.TypeAndId } },
            { "id", new AttributeValue { S = user.Id.ToString() } },
            { "email", new AttributeValue { S = user.Email } },
            { "passwordHash", new AttributeValue { S = user.PasswordHash } },
            { "salt", new AttributeValue { S = user.Salt } },
            { "createdBy", new AttributeValue { N = "1" } },
            { "lastModifiedBy", new AttributeValue { N = "1" } },
            { "createdDate", new AttributeValue { S = user.CreatedDate.ToString("o") } },
            { "lastModifiedDate", new AttributeValue { S = user.LastModifiedDate.ToString("o") } },
            { "version", new AttributeValue { N = "1" } }
        };

        await _dynamoDBClient.PutItemAsync(TABLE_NAME, dict);

        var token = GenerateJwt(user);
        return new AuthResponse
        {
            Token = token,
            User = new UserDto { Id = user.Id.ToString(), Email = user.Email }
        };
    }

    public async Task<AuthResponse> Login(string email, string password)
    {
        var user = await GetUserByEmail(email);
        if (user == null)
            throw new UnauthorizedAccessException("Invalid email or password");

        var passwordHash = HashPassword(password, user.Salt);
        if (passwordHash != user.PasswordHash)
            throw new UnauthorizedAccessException("Invalid email or password");

        var token = GenerateJwt(user);
        return new AuthResponse
        {
            Token = token,
            User = new UserDto { Id = user.Id.ToString(), Email = user.Email }
        };
    }

    public ClaimsPrincipal? ValidateToken(string token)
    {
        try
        {
            var tokenHandler = new JwtSecurityTokenHandler();
            var key = Encoding.UTF8.GetBytes(_jwtSecret);

            var principal = tokenHandler.ValidateToken(token, new TokenValidationParameters
            {
                ValidateIssuerSigningKey = true,
                IssuerSigningKey = new SymmetricSecurityKey(key),
                ValidateIssuer = false,
                ValidateAudience = false,
                ClockSkew = TimeSpan.Zero
            }, out _);

            return principal;
        }
        catch
        {
            return null;
        }
    }

    private string GenerateJwt(User user)
    {
        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_jwtSecret));
        var credentials = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var claims = new[]
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id.ToString()),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(JwtRegisteredClaimNames.Iat, DateTimeOffset.UtcNow.ToUnixTimeSeconds().ToString())
        };

        var token = new JwtSecurityToken(
            claims: claims,
            expires: DateTime.UtcNow.AddDays(7),
            signingCredentials: credentials
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    private async Task<User?> GetUserByEmail(string email)
    {
        var normalized = email.ToLowerInvariant().Trim();
        var request = new ScanRequest
        {
            TableName = TABLE_NAME,
            FilterExpression = "#type = :type AND email = :email",
            ExpressionAttributeNames = new Dictionary<string, string>
            {
                { "#type", Constants.ID_KEY }
            },
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":type", new AttributeValue { S = $"User|" } },
                { ":email", new AttributeValue { S = normalized } }
            }
        };

        var response = await _dynamoDBClient.ScanAsync(request);
        if (response.Items.Count == 0) return null;

        var item = response.Items[0];
        return new User
        {
            Id = Guid.Parse(item["id"].S),
            Email = item["email"].S,
            PasswordHash = item["passwordHash"].S,
            Salt = item["salt"].S,
            CreatedBy = int.Parse(item["createdBy"].N),
            LastModifiedBy = int.Parse(item["lastModifiedBy"].N),
            CreatedDate = DateTime.Parse(item["createdDate"].S),
            LastModifiedDate = DateTime.Parse(item["lastModifiedDate"].S),
            Version = int.Parse(item["version"].N)
        };
    }

    private static string GenerateSalt()
    {
        var bytes = RandomNumberGenerator.GetBytes(32);
        return Convert.ToBase64String(bytes);
    }

    private static string HashPassword(string password, string salt)
    {
        var saltBytes = Convert.FromBase64String(salt);
        var hash = Rfc2898DeriveBytes.Pbkdf2(
            Encoding.UTF8.GetBytes(password),
            saltBytes,
            iterations: 600000,
            HashAlgorithmName.SHA256,
            outputLength: 32
        );
        return Convert.ToBase64String(hash);
    }
}
