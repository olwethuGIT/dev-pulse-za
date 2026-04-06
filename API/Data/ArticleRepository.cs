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

    public async Task<IReadOnlyList<Article>> GetTopArticles()
    {
        var recentArticles = await context.Articles
            .Where(a => a.IsApproved)
            .OrderByDescending(a => a.CreatedAt)
            .Take(100)
            .ToListAsync();

        var topArticles = recentArticles
            .Select(a =>
            {
                var avgReadTime = a.ViewsCount == 0
                    ? 0
                    : (double)a.TotalReadTime / a.ViewsCount;

                var daysOld = (DateTime.UtcNow - a.CreatedAt).TotalDays;

                var score =
                    (a.ViewsCount * 1) +
                    (avgReadTime * 2) +
                    (a.Likes.Count * 3) -
                    (daysOld * 0.5);

                return new
                {
                    Article = a,
                    Score = score
                };
            })
            .OrderByDescending(x => x.Score)
            .Take(5)
            .Select(x => x.Article)
            .ToList();

        return topArticles;
    }

    public void UpdateArticle(Article article)
    {
        context.Entry(article).State = EntityState.Modified;
    }

    public async Task<bool> SaveChanges()
    {
        return await context.SaveChangesAsync() > 0;
    }
}
