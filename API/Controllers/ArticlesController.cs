using API.Entities;
using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArticlesController(IArticleRepository articleRepository) : BaseApiController
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
    }
}
