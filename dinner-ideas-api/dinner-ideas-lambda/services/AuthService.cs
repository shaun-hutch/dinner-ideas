using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Cryptography;
using System.Text;
using Amazon.DynamoDBv2.Model;
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
    private readonly IDatabaseClientService _db;
    private readonly string _jwtSecret;

    public AuthService(IDatabaseClientService db)
    {
        _db = db;
        _jwtSecret = Environment.GetEnvironmentVariable("JWT_SECRET")
            ?? throw new InvalidOperationException("JWT_SECRET not configured");
    }

    public async Task<AuthResponse> Register(string email, string password)
    {
        var existingUser = await GetUserByEmail(email);
        if (existingUser != null)
            throw new InvalidOperationException("A user with this email already exists");

        var salt = GenerateSalt();
        var passwordHash = HashPassword(password, salt);

        var user = new User
        {
            Id = Guid.NewGuid(),
            Email = email.ToLowerInvariant().Trim(),
            PasswordHash = passwordHash,
            Salt = salt,
            CreatedBy = 1,
            LastModifiedBy = 1,
            CreatedDate = DateTime.UtcNow,
            LastModifiedDate = DateTime.UtcNow,
            Version = 1
        };

        await _db.CreateItem(user);

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
            FilterExpression = "begins_with(#type, :type) AND email = :email",
            ExpressionAttributeNames = new Dictionary<string, string>
            {
                { "#type", Constants.ID_KEY }
            },
            ExpressionAttributeValues = new Dictionary<string, AttributeValue>
            {
                { ":type", new AttributeValue { S = "User|" } },
                { ":email", new AttributeValue { S = normalized } }
            }
        };

        var results = await _db.ScanAsync<User>(request);
        return results.FirstOrDefault();
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
