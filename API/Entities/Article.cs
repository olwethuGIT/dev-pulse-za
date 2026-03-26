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
    public string AuthorId { get; set; } = null!;
    public int CategoryId { get; set; }
    [ForeignKey(nameof(AuthorId))]
    public AppUser Author { get; set; } = null!;
    
    [ForeignKey(nameof(CategoryId))]
    public Category Category { get; set; } = null!;
    
    public List<ArticleLike> Likes { get; set; } = [];
    public List<Comment> Comments { get; set; } = [];
}
