using API.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ArticlesController(IArticleRepository articleRepository) : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult> GetArticles()
        {
            return Ok(await articleRepository.GetArticlesAsync());
        }
    }
}
