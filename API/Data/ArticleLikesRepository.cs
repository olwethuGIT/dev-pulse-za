using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ArticleLikesRepository(AppDbContext context) : IArticleLikeRepository
{
    public void AddLike(ArticleLike like)
    {
        context.ArticleLikes.Add(like);
    }

    public async Task<IReadOnlyList<ArticleLike>> GetArticleLikes(string articleId)
    {
        return await context.ArticleLikes.Where(l => l.ArticleId == articleId).ToListAsync();
    }

    public void RemoveLike(ArticleLike like)
    {
        context.ArticleLikes.Remove(like);
    }

    public async Task<bool> SaveAllChangesAsync()
    {
        return await context.SaveChangesAsync() > 0;
    }

    public async Task<ArticleLike?> UserLikedArticle(string userId, string articleId)
    {
        return await context.ArticleLikes.FindAsync(userId, articleId);
    }
}
