import { ForumPost } from '../entities/forum-post.entity';
export interface IForumPostRepository {
    findAll(): Promise<ForumPost[]>;
    findById(id: string): Promise<ForumPost | null>;
    save(post: ForumPost): Promise<ForumPost>;
}
export declare const FORUM_POST_REPOSITORY: unique symbol;
