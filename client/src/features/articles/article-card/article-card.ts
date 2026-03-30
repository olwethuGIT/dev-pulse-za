import { Component, inject, input } from '@angular/core';
import { ArticleDto } from '../../../types/article';
import { LikeButton } from '../../../shared/like-button/like-button';
import { CommentButton } from '../../../shared/comment-button/comment-button';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../core/services/likes-service';

@Component({
  selector: 'app-article-card',
  imports: [LikeButton, CommentButton, RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard {
  article = input.required<ArticleDto>();
  private likeService = inject(LikesService);

  toggleLike(articleId: string) {
    this.likeService.toggleArticleLike(articleId).subscribe();
  }
}
