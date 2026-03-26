import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class LikesService {
  private baseUrl = environment.apiUrl;
  private http = inject(HttpClient);

  getArticleLikesCount(articleId: string) {
    return this.http.get<Number>(`${this.baseUrl}articleLikes/${articleId}/count`);
  }

  toggleArticleLike(articleId: string, userId: string) {
    return this.http.post(`${this.baseUrl}articleLikes/${articleId}/${userId}`, {});
  }
}
