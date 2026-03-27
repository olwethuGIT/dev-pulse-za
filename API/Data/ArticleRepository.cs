using System;
using API.Dto;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ArticleRepository(AppDbContext context) : IArticleRepository
{
    public async Task<Article> GetArticleByIdAsync(string id)
    {
        return await context.Articles.Include(a => a.Author)
            .Include(a => a.Category)
            .Include(a => a.Likes)
            .Where(a => a.Id == id && a.IsApproved)
            .FirstAsync();
    }

    public async Task<IReadOnlyList<ArticleDto>> GetArticlesAsync()
    {
        return await context.Articles
            .Where(a => a.IsApproved)
            .Select(a => new ArticleDto
            {
                Id = a.Id,
                Title = a.Title,
                Content = a.Content,
                CreatedAt = a.CreatedAt,
                AuthorName = a.Author.DisplayName,
                CategoryName = a.Category.Name,
                LikesCount = a.Likes.Count,
                CommentsCount = a.Comments.Count
            })
            .ToListAsync();
    }
}
