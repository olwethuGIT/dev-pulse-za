using System;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers;

public class ArticleLikesController(IArticleLikeRepository likeRepository) : BaseApiController
{
    [HttpPost("{articleId}/{userId}")]
    public async Task<ActionResult> ToggleLike(string articleId, string userId)
    {
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
        
        if(await likeRepository.SaveAllChangesAsync())
        {
            return Ok();
        }

        return BadRequest("Failed to update like");
    }

    [HttpGet("{articleId}/count")]
    public async Task<ActionResult<int>> GetArticleLikesCount(string articleId)
    {
        return Ok(await likeRepository.GetArticleLikesCount(articleId));
    }
}
