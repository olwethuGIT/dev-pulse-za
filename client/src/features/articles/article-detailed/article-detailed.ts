import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../../core/services/articles-service';
import { CommentButton } from '../../../shared/comment-button/comment-button';
import { LikeButton } from '../../../shared/like-button/like-button';
import { LikesService } from '../../../core/services/likes-service';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-article-detailed',
  imports: [LikeButton, CommentButton],
  templateUrl: './article-detailed.html',
  styleUrl: './article-detailed.css',
})
export class ArticleDetailed {
  protected articleService = inject(ArticlesService);
  private likeService = inject(LikesService);

  toggleLike(article: Article) {
      this.likeService.toggleArticleLike(article.id, 'john-id').subscribe({
          next: () => {}
      });
    }
}
