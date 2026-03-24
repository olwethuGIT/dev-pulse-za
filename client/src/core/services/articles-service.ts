import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment.development';
import { Article } from '../../types/article';

@Injectable({
  providedIn: 'root',
})
export class ArticlesService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getArticles() {
    return this.http.get<Article[]>(`${this.baseUrl}articles`);
  }
}
