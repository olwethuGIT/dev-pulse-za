import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Article, ArticleDto } from '../../types/article';
import { tap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  article = signal<Article | null>(null);

  getArticles() {
    return this.http.get<ArticleDto[]>(`${this.baseUrl}articles`);
  }

  getArticle(id: string) {
    return this.http.get<Article>(`${this.baseUrl}articles/${id}`).pipe(
      tap((article) => {
        this.article.set(article);
        return article;
      }),
    );
  }
}
