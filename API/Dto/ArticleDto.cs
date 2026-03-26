using System;

namespace API.Dto;

public class ArticleDto
{
    public required string Id { get; set; }
    public required string Title { get; set; }
    public required string Content { get; set; }
    public DateTime CreatedAt { get; set; } = DateTime.UtcNow;
    public required string AuthorName { get; set; }
    public required string CategoryName { get; set; }
    public int LikesCount { get; set; }
}
