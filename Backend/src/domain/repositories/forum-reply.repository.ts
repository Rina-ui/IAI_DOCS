import { ForumReply } from '../entities/forum-reply.entity';

export interface IForumReplyRepository {
    findByPost(postId: string): Promise<ForumReply[]>;
    findById(id: string): Promise<ForumReply | null>;
    save(reply: ForumReply): Promise<ForumReply>;
}
export const FORUM_REPLY_REPOSITORY = Symbol('IForumReplyRepository');