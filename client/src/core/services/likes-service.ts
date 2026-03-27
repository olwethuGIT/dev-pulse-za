import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs';
import { ArticlesService } from './articles-service';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);
  private articleService = inject(ArticlesService);

  getArticleLikesCount(articleId: string) {
    return this.http.get<Number>(`${this.baseUrl}articleLikes/${articleId}/count`);
  }

  toggleArticleLike(articleId: string, userId: string) {
    return this.http.post<[]>(`${this.baseUrl}articleLikes/${articleId}/${userId}`, {}).pipe(
      tap((likes) => {
        this.articleService.articleList.update((articles) => {
          if (!articles) return articles;

          return articles.map((article) =>
            article.id === articleId ? { ...article, likesCount: likes.length } : article,
          );
        });
        
        return likes;
      } ),
    );
  }
}
