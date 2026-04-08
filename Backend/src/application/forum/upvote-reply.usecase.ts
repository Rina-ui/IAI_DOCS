import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as forumReplyRepository from '../../domain/repositories/forum-reply.repository';

@Injectable()
export class UpvoteReplyUseCase {
    constructor(
        @Inject(forumReplyRepository.FORUM_REPLY_REPOSITORY) private replyRepo: forumReplyRepository.IForumReplyRepository,
    ) {}

    async execute(replyId: string) {
        const reply = await this.replyRepo.findById(replyId);
        if (!reply) throw new NotFoundException('Reply not found');
        reply.upvote();
        return this.replyRepo.save(reply);
    }
}