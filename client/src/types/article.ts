export type ArticleDto = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  authorName: string;
  categoryName: string;
  likesCount: number;
};

export type Article = {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  isApproved: boolean;
  authorId: string;
  author: {
    id: string;
    displayName: string;
    email: string;
  };
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
