import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as forumPostRepository from '../../domain/repositories/forum-post.repository';
import * as forumReplyRepository from '../../domain/repositories/forum-reply.repository';
import {ForumReply} from '../../domain/entities/forum-reply.entity';
import {v4 as uuidv4} from 'uuid';

@Injectable()
export class ReplyPostUseCase {
    constructor(
        @Inject(forumPostRepository.FORUM_POST_REPOSITORY) private forumRepo: forumPostRepository.IForumPostRepository,
        @Inject(forumReplyRepository.FORUM_REPLY_REPOSITORY) private replyRepo: forumReplyRepository.IForumReplyRepository,
    ) {}

    async execute(postId: string, authorId: string, content: string): Promise<ForumReply> {
        const post = await this.forumRepo.findById(postId);
        if (!post) throw new NotFoundException('Post not found');

        const reply = new ForumReply(uuidv4(), postId, authorId, content);
        return this.replyRepo.save(reply);
    }
}