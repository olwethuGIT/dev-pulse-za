import { Routes } from '@angular/router';
import { ArticleList } from '../features/articles/article-list/article-list';
import { ArticleDetailed } from '../features/articles/article-detailed/article-detailed';
import { articleResolver } from '../features/articles/article-resolver';

export const routes: Routes = [
  {
    path: '',
    children: [
      { path: '', component: ArticleList },
      {
        path: 'article/:id',
        resolve: { article: articleResolver },
        runGuardsAndResolvers: 'always',
        component: ArticleDetailed,
      },
    ],
  },
];
