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
};
