using System.Text.Json.Serialization;

namespace API.Entities;

public class AppUser
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string DisplayName { get; set; }
    public required string Email { get; set; }
    [JsonIgnore]
    public List<Article> Articles { get; set; } = [];
    [JsonIgnore]
    public List<ArticleLike> LikedArticles { get; set; } = [];
}
