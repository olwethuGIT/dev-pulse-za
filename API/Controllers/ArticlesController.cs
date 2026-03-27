using API.Dto;
using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArticlesController(IArticleRepository articleRepository, ICommentService commentService, IMemberRepository memberRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Article>>> GetArticles()
        {
            return Ok(await articleRepository.GetArticlesAsync());
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Article>> GetArticle(string id)
        {
            var article = await articleRepository.GetArticleByIdAsync(id);

            if (article == null) return NotFound("Article not found");

            return Ok(article);
        }

        [HttpPost("comment")]
        public async Task<ActionResult> AddComment(CommentDto commentDto)
        {
            var article = await articleRepository.GetArticleByIdAsync(commentDto.ArticleId);

            if (article == null) return NotFound("Article not found");

            var user = await memberRepository.GetMemberByIdAsync(commentDto.UserId);

            var comment = new Comment
            {
                Content = commentDto.Content,
                UserId = commentDto.UserId,
                User = user,
                ArticleId = commentDto.ArticleId,
                ParentCommentId = commentDto.ParentCommentId
            };

            var commentToReturn = await commentService.CreateComment(comment);

            if (commentToReturn != null) return Ok(commentToReturn);

            return BadRequest("Failed to add comment");
        }

        [HttpGet("{articleId}/comments")]
        public async Task<ActionResult<IReadOnlyList<Comment>>> GetComments(string articleId)
        {
            return Ok(await commentService.GetCommentsByArticleIdAsync(articleId));
        }

        [HttpDelete("comment/{commentId}")]
        public async Task<ActionResult> DeleteComment(string commentId)
        {
            var comment = await commentService.GetCommentByIdAsync(commentId);

            if (comment == null) return NotFound("Comment not found");

            commentService.DeleteComment(comment);

            if (await commentService.SaveAllChangesAsync()) return NoContent();

            return BadRequest("Failed to delete comment");
        }

        [HttpPut("update-comment")]
        public async Task<ActionResult> UpdateComment(CommentDto commentDto)
        {
            if (string.IsNullOrEmpty(commentDto.Id)) return BadRequest("Comment ID is required");

            var comment = await commentService.GetCommentByIdAsync(commentDto.Id);

            if (comment == null) return NotFound("Comment not found");

            comment.Content = commentDto.Content;

            commentService.UpdateComment(comment);

            if (await commentService.SaveAllChangesAsync()) return NoContent();

            return BadRequest("Failed to update comment");
        }
    }
}
