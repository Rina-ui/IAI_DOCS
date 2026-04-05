import * as forumPostRepository from '../../domain/repositories/forum-post.repository';
export declare class UpvotePostUseCase {
    private forumRepo;
    constructor(forumRepo: forumPostRepository.IForumPostRepository);
    execute(postId: string): Promise<import("../../domain/entities/forum-post.entity").ForumPost>;
}
