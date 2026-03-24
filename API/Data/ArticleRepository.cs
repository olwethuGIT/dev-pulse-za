using System;
using API.Entities;
using API.Interfaces;
using Microsoft.EntityFrameworkCore;

namespace API.Data;

public class ArticleRepository(AppDbContext context) : IArticleRepository
{
    public async Task<IReadOnlyList<Article>> GetArticlesAsync()
    {
        return await context.Articles
            .Include(a => a.Author)
            .Include(a => a.Category)
            .Where(a => a.IsApproved)
            .ToListAsync();
    }
}
