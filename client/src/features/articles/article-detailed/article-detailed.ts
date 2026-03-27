import {
  Component,
  computed,
  HostListener,
  inject,
  OnInit,
  signal,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ArticlesService } from '../../../core/services/articles-service';
import { CommentButton } from '../../../shared/comment-button/comment-button';
import { LikeButton } from '../../../shared/like-button/like-button';
import { LikesService } from '../../../core/services/likes-service';
import { Article, Comments } from '../../../types/article';
import { Location } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-article-detailed',
  imports: [LikeButton, CommentButton, FormsModule],
  templateUrl: './article-detailed.html',
  styleUrl: './article-detailed.css',
})
export class ArticleDetailed implements OnInit {
  @ViewChild('commentForm') commentForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.commentForm?.dirty) {
      $event.preventDefault();
    }
  }

  protected articleService = inject(ArticlesService);
  private likeService = inject(LikesService);
  protected route = inject(ActivatedRoute);
  protected currentArticleId = computed(() => {
    return this.route.snapshot.paramMap.get('id');
  });

  protected comments = signal<Comments[]>([]);
  private location = inject(Location);
  protected comment: Comments = {
    id: '',
    content: '',
    userId: 'jane-id',
    articleId: this.currentArticleId() || '',
    parentCommentId: null,
  };

  ngOnInit(): void {
    this.loadComments();
  }

  toggleLike(article: Article) {
    this.likeService.toggleArticleLike(article.id, 'john-id').subscribe({
      next: (likes) => {
        this.articleService.article.update((currentArticle) => {
          if (!currentArticle) return currentArticle;
          return { ...currentArticle, likes: likes };
        });
      },
    });
  }

  loadComments() {
    let articleId = this.currentArticleId();
    if (!articleId) return;

    this.articleService.getArticleComments(articleId).subscribe({
      next: (comments) => {
        this.comments.set(comments);
      },
    });
  }

  submitComment() {
    if (!this.comment.content.trim()) return;

    this.articleService.addComment(this.comment).subscribe({
      next: (newComment) => {
        this.comments.update((comments) => [newComment, ...comments]);
        this.comment.content = '';
        this.commentForm?.resetForm();
      },
    });
  }

  goBack() {
    this.location.back();
  }
}
