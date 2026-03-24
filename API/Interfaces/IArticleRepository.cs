using System;
using API.Entities;

namespace API.Interfaces;

public interface IArticleRepository
{
    Task<IReadOnlyList<Article>> GetArticlesAsync();
}
