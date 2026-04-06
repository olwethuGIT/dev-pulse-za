using API.Dto;
using API.Entities;

namespace API.Interfaces;

public interface IArticleRepository
{
    Task<IReadOnlyList<ArticleDto>> GetArticlesAsync();
    Task<Article> GetArticleByIdAsync(string id);
    Task<IReadOnlyList<Article>> GetTopArticles();
    void UpdateArticle(Article article);
    Task<bool> SaveChanges();
}
