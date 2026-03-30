using System.Text.Json.Serialization;

namespace API.Entities;

public class AppUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    public bool RegisteredForNewsletter { get; set; } = true;
    public bool emailConfirmed { get; set; } = false;
    public string? ImageUrl { get; set; }
    public required byte[] PasswordHash { get; set; }
    public required byte[] PasswordSalt { get; set; }
    [JsonIgnore]
    public List<Article> Articles { get; set; } = [];
    [JsonIgnore]
    public List<ArticleLike> LikedArticles { get; set; } = [];
}
