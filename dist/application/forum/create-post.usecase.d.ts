import * as forumPostRepository from '../../domain/repositories/forum-post.repository';
import { ForumPost } from '../../domain/entities/forum-post.entity';
export declare class CreatePostUseCase {
    private forumRepo;
    constructor(forumRepo: forumPostRepository.IForumPostRepository);
    execute(authorId: string, title: string, content: string): Promise<ForumPost>;
}
