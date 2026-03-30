using System;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

[Authorize]
public class ArticleLikesController(IArticleLikeRepository likeRepository) : BaseApiController
{
    [HttpPost("{articleId}")]
    public async Task<ActionResult<IReadOnlyList<ArticleLike>>> ToggleLike(string articleId)
    {
        var userId = User.GetUserId();
        var existingLike = await likeRepository.UserLikedArticle(userId, articleId);

        if (existingLike == null)
        {
            var like = new ArticleLike
            {
                ArticleId = articleId,
                UserId = userId
            };

            likeRepository.AddLike(like);
        }
        else
        {
            likeRepository.RemoveLike(existingLike);
        }

        if (await likeRepository.SaveAllChangesAsync())
        {
            var likes = await likeRepository.GetArticleLikes(articleId);
            return Ok(likes);
        }

        return BadRequest("Failed to update like");
    }

    [HttpGet("{articleId}/count")]
    public async Task<ActionResult<int>> GetArticleLikesCount(string articleId)
    {
        var likes = await likeRepository.GetArticleLikes(articleId);
        return Ok(likes.Count);
    }
}
