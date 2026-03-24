import { Component, input } from '@angular/core';
import { Article } from '../../../types/article';

@Component({
  selector: 'app-article-card',
  imports: [],
  templateUrl: './article-card.html',
  styleUrl: './article-card.css',
})
export class ArticleCard {
  article = input.required<Article>();
}
