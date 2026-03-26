using System;
using API.Entities;

namespace API.Interfaces;

public interface IArticleLikeRepository
{
    Task<ArticleLike?> UserLikedArticle(string userId, string articleId);
    Task<int> GetArticleLikesCount(string articleId);
    void AddLike(ArticleLike like);
    void RemoveLike(ArticleLike like);
    Task<bool> SaveAllChangesAsync();
}
