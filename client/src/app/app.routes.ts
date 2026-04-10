import { Routes } from '@angular/router';
import { ArticleList } from '../features/articles/article-list/article-list';
import { ArticleDetailed } from '../features/articles/article-detailed/article-detailed';
import { articleResolver } from '../features/articles/article-resolver';
import { OauthCallbackComponent } from '../auth/oauth-callback/oauth-callback';

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
  {
    path: 'auth/callback',
    component: OauthCallbackComponent,
  },
];
