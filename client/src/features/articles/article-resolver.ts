import { ResolveFn, Router } from '@angular/router';
import { Article } from '../../types/article';
import { inject } from '@angular/core';
import { ArticlesService } from '../../core/services/articles-service';
import { EMPTY } from 'rxjs';

export const articleResolver: ResolveFn<Article> = (route, state) => {
  const articleService = inject(ArticlesService);
  const router = inject(Router);
  const articleId = route.paramMap.get('id');

  if (!articleId) {
    router.navigateByUrl('/not-found');
    return EMPTY;
  }

  return articleService.getArticle(articleId);
};
