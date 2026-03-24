using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace API.Entities;

public class Article
{
    public string Id { get; set; } = Guid.NewGuid().ToString();
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public DateTime UpdatedAt { get; set; }
    public Boolean IsApproved { get; set; }
    [JsonIgnore]
    [ForeignKey(nameof(Id))]
    public AppUser User { get; set; } = null!;
    public string AuthorId { get; set; } = null!;
}
