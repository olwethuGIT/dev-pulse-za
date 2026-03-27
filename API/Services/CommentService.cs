using System;
using API.Data;
using API.Dto;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Services;

public class CommentService(AppDbContext context) : ICommentService
{
    public async Task<Comment> CreateComment(Comment comment)
    {
        context.Comments.Add(comment);
        await context.SaveChangesAsync();
        return comment;
    }

    public void DeleteComment(Comment comment)
    {
        context.Comments.Remove(comment);
    }

    public async Task<IReadOnlyList<Comment>> GetCommentsByArticleIdAsync(string articleId)
    {
        return await context.Comments
            .Where(c => c.ArticleId == articleId && c.ParentCommentId == null)
            .Include(c => c.User)
            .Include(c => c.Replies)
                .ThenInclude(r => r.User)
            .ToListAsync();
    }

    public void UpdateComment(Comment comment)
    {
        context.Comments.Update(comment);
    }

    public async Task<bool> SaveAllChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<Comment?> GetCommentByIdAsync(string commentId)
    {
        return await context.Comments.FindAsync(commentId);
    }
}
