import { Component, inject } from '@angular/core';
import { ArticlesService } from '../../../core/services/articles-service';
import { ArticleCard } from '../article-card/article-card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-article-list',
  imports: [ArticleCard, RouterLink],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  protected articleService = inject(ArticlesService);

  constructor() {
    this.articleService.getArticles().subscribe();
    this.articleService.getTopArticles().subscribe();
    this.articleService.getCategories().subscribe();
  }
}
