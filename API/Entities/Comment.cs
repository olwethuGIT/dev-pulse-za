using System;

namespace API.Entities;

public class Comment
{
    public string Id { get; set; } = Guid.NewGuid().ToString();

    public string Content { get; set; } = null!;
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

    public string UserId { get; set; } = null!;
    public AppUser User { get; set; } = null!;

    public string ArticleId { get; set; } = null!;
    public Article Article { get; set; } = null!;

    // 🔥 Self-reference (this is the key)
    public string? ParentCommentId { get; set; }
    public Comment? ParentComment { get; set; }

    public List<Comment> Replies { get; set; } = [];
}