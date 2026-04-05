import { CreatePostUseCase } from '../../../application/forum/create-post.usecase';
import { UpvotePostUseCase } from '../../../application/forum/upvote-post.usecase';
import * as forumPostRepository from '../../../domain/repositories/forum-post.repository';
export declare class ForumController {
    private createPost;
    private upvotePost;
    private forumRepo;
    constructor(createPost: CreatePostUseCase, upvotePost: UpvotePostUseCase, forumRepo: forumPostRepository.IForumPostRepository);
    findAll(): Promise<import("../../../domain/entities/forum-post.entity").ForumPost[]>;
    create(body: {
        title: string;
        content: string;
    }, user: any): Promise<import("../../../domain/entities/forum-post.entity").ForumPost>;
    upvote(id: string): Promise<import("../../../domain/entities/forum-post.entity").ForumPost>;
}
