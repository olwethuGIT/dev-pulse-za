import { Component, inject } from '@angular/core';
import { ArticlesService } from '../../../core/services/articles-service';
import { Observable } from 'rxjs';
import { Article } from '../../../types/article';
import { AsyncPipe } from '@angular/common';
import { ArticleCard } from '../article-card/article-card';

@Component({
  selector: 'app-article-list',
  imports: [AsyncPipe, ArticleCard],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  private articleService = inject(ArticlesService);
  protected articles$: Observable<Article[]>;

  constructor() {
    this.articles$ = this.articleService.getArticles();
  }
}
