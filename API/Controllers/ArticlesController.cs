using API.Dto;
using API.Entities;
using API.Extensions;
using API.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    [Authorize]
    public class ArticlesController(IArticleRepository articleRepository, ICommentService commentService, IMemberRepository memberRepository, ICategoryService categoryService) : BaseApiController
    {
        [AllowAnonymous]
        [HttpGet]
        public async Task<ActionResult<IReadOnlyList<Article>>> GetArticles()
        {
            return Ok(await articleRepository.GetArticlesAsync());
        }

        [AllowAnonymous]
        [HttpGet("top")]
        public async Task<ActionResult<IReadOnlyList<Article>>> GetTopArticles()
        {
            return Ok(await articleRepository.GetTopArticles());
        }

        [AllowAnonymous]
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

            Console.WriteLine("Adding comment for article: " + User.GetUserId());
            var user = await memberRepository.GetMemberByIdAsync(User.GetUserId());

            if (user == null) return NotFound("User not found");

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

        [AllowAnonymous]
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

        [AllowAnonymous]
        [HttpGet("categories")]
        public async Task<ActionResult<IReadOnlyList<Category>>> GetCategories()
        {
            return Ok(await categoryService.GetAllCategories());
        }

        [AllowAnonymous]
        [HttpPut("{articleId}/record-view")]
        public async Task<ActionResult> RecordView(string articleId)
        {
            var article = await articleRepository.GetArticleByIdAsync(articleId);

            if (article == null) return NotFound("Article not found");

            article.ViewsCount += 1;

            articleRepository.UpdateArticle(article);

            if (await articleRepository.SaveChanges()) return NoContent();

            return BadRequest("Failed to record view");
        }

        [AllowAnonymous]
        [HttpPut("{articleId}/read-time")]
        public async Task<ActionResult> UpdateReadTime(string articleId, [FromQuery] int readTime)
        {
            var article = await articleRepository.GetArticleByIdAsync(articleId);

            if (article == null) return NotFound("Article not found");

            article.TotalReadTime += readTime;

            articleRepository.UpdateArticle(article);

            if (await articleRepository.SaveChanges()) return NoContent();

            return BadRequest("Failed to update read time");
        }
    }
}
