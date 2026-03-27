import { Component, inject } from '@angular/core';
import { ArticlesService } from '../../../core/services/articles-service';
import { Observable } from 'rxjs';
import { ArticleDto } from '../../../types/article';
import { AsyncPipe } from '@angular/common';
import { ArticleCard } from '../article-card/article-card';

@Component({
  selector: 'app-article-list',
  imports: [ArticleCard],
  templateUrl: './article-list.html',
  styleUrl: './article-list.css',
})
export class ArticleList {
  protected articleService = inject(ArticlesService);

  constructor() {
    this.articleService.getArticles().subscribe();
  }
}
