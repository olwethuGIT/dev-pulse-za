using System;
using System.Text.Json.Serialization;

namespace API.Entities;

public class ArticleLike
{
    public required string UserId { get; set; }
    [JsonIgnore]
    public AppUser User { get; set; } = null!;
    public required string ArticleId { get; set; }
    [JsonIgnore]
    public Article Article { get; set; } = null!;
}
