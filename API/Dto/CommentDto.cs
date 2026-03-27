using System;
using System.ComponentModel.DataAnnotations;

namespace API.Dto;

public class CommentDto
{
    public string? Id { get; set; }
    [Required]
    public string Content { get; set; } = "";
    [Required]
    public string UserId { get; set; } = "";
    [Required]
    public string ArticleId { get; set; } = "";
    public string? ParentCommentId { get; set; }
}
