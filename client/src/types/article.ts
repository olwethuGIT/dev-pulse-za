import { User } from "./user";

export type ArticleDto = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  categoryName: string;
  likesCount: Number;
  commentsCount: number;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  authorId: string;
  author: User;
  category: {
    id: string;
    name: string;
  };
  likes: ArticleLike[];
};

export interface ArticleLike {
  userId: string;
  articleId: string;
}

export interface Comments {
  id: string;
  content: string;
  createdAt?: string;
  userId?: string;
  user?: User;
  articleId: string;
  parentCommentId: string | null;
  replies?: Comments[];
}
