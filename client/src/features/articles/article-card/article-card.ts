import { Component, inject, input, OnInit } from '@angular/core';
import { ArticleDto } from '../../../types/article';
import { LikeButton } from '../../../shared/like-button/like-button';
import { CommentButton } from '../../../shared/comment-button/comment-button';
import { RouterLink } from '@angular/router';
import { LikesService } from '../../../core/services/likes-service';
import { calculateReadTime } from '../../../core/utilities/utils';

@Component({
  selector: 'app-article-card',
  imports: [LikeButton, CommentButton, RouterLink],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard implements OnInit {
  article = input.required<ArticleDto>();
  private likeService = inject(LikesService);
  protected readTime = 0;

  ngOnInit() {
    this.readTime = calculateReadTime(this.article().content);
  }

  toggleLike(articleId: string) {
    this.likeService.toggleArticleLike(articleId).subscribe({
      next: () => {},
      error: (err) => console.error('Error toggling like:', err),
    });
  }

  getPreview(content: string, limit: number = 150): string {
    return content.length > limit ? content.substring(0, limit) + '...' : content;
  }
}
