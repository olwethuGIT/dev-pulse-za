import {
  Component,
  computed,
  HostListener,
  inject,
  OnDestroy,
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
import { AccountService } from '../../../core/services/account-service';
import { ModalService } from '../../../core/services/modal-service';
import { calculateReadTime } from '../../../core/utilities/utils';

@Component({
  selector: 'app-article-detailed',
  imports: [LikeButton, CommentButton, FormsModule],
  templateUrl: './article-detailed.html',
  styleUrl: './article-detailed.css',
})
export class ArticleDetailed implements OnInit, OnDestroy {
  @ViewChild('commentForm') commentForm?: NgForm;
  @HostListener('window:beforeunload', ['$event']) notify($event: BeforeUnloadEvent) {
    if (this.commentForm?.dirty) {
      $event.preventDefault();
    }
  }

  private accountService = inject(AccountService);
  private modalService = inject(ModalService);
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
    articleId: this.currentArticleId() || '',
    parentCommentId: null,
  };
  protected readTime = 0;
  private startTime = Date.now();

  ngOnInit(): void {
    this.startTime = Date.now();
    this.loadComments();
    this.readTime = calculateReadTime(this.articleService.article()?.content || '');
    this.recordView();
  }

  recordView() {
    let articleId = this.currentArticleId();
    if (!articleId) return;

    const key = `viewed-${articleId}`;
    if (!localStorage.getItem(key)) {
      this.articleService.recordView(articleId).subscribe();
      localStorage.setItem(key, 'true');
    }
  }

  toggleLike(article: Article) {
    this.likeService.toggleArticleLike(article.id).subscribe({
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
    if (this.accountService.currentUser() == null) {
      this.modalService.open();
      return;
    }

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

  ngOnDestroy(): void {
    const seconds = Math.floor((Date.now() - this.startTime) / 1000);

    if (seconds > 3) {
      this.articleService.recordReadTime(this.articleService.article()!.id, seconds).subscribe();
    }
  }
}
