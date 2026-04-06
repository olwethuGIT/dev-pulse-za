import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { Article, ArticleDto, Comments } from '../../types/article';
import { tap } from 'rxjs';
import { Category } from '../../types/category';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  article = signal<Article | null>(null);
  articleList = signal<ArticleDto[] | null>(null);
  topArticleList = signal<ArticleDto[] | null>(null);
  categoryList = signal<Category[] | null>(null);

  getArticles() {
    return this.http.get<ArticleDto[]>(`${this.baseUrl}articles`).pipe(
      tap((articles) => {
        this.articleList.set(articles);
      }),
    );
  }
  
  getTopArticles() {
    return this.http.get<ArticleDto[]>(`${this.baseUrl}articles/top`).pipe(
      tap((articles) => {
        this.topArticleList.set(articles);
      }),
    );
  }

  getArticle(id: string) {
    return this.http.get<Article>(`${this.baseUrl}articles/${id}`).pipe(
      tap((article) => {
        this.article.set(article);
        return article;
      }),
    );
  }

  getArticleComments(articleId: string) {
    return this.http.get<Comments[]>(`${this.baseUrl}articles/${articleId}/comments`);
  }

  addComment(comment: Comments) {
    return this.http.post<Comments>(`${this.baseUrl}articles/comment`, comment);
  }

  getCategories() {
    return this.http.get<Category[]>(`${this.baseUrl}articles/categories`).pipe(
      tap((categories) => {
        this.categoryList.set(categories);
        return categories;
      }),
    );
  }

  recordView(articleId: string) {
    return this.http.put(`${this.baseUrl}articles/${articleId}/record-view`, {});
  }

  recordReadTime(articleId: string, readTime: number) {
    return this.http.put(`${this.baseUrl}articles/${articleId}/read-time?readTime=${readTime}`, {});
  }
}
