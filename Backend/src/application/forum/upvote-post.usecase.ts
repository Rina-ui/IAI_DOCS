import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as forumPostRepository from '../../domain/repositories/forum-post.repository';

@Injectable()
export class UpvotePostUseCase {
  constructor(
    @Inject(forumPostRepository.FORUM_POST_REPOSITORY)
    private forumRepo: forumPostRepository.IForumPostRepository,
  ) {}

  async execute(postId: string) {
    const post = await this.forumRepo.findById(postId);
    if (!post) throw new NotFoundException('Post not found');
    post.upvote();
    return this.forumRepo.save(post);
  }
}
