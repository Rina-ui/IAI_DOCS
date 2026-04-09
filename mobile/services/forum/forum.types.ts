export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}
