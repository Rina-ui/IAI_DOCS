import { ForumPost } from '../entities/forum-post.entity';

export interface IForumPostRepository {
  findAll(): Promise<ForumPost[]>;
  findById(id: string): Promise<ForumPost | null>;
  save(post: ForumPost): Promise<ForumPost>;
}
export const FORUM_POST_REPOSITORY = Symbol('IForumPostRepository');
