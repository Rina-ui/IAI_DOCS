import { Inject, Injectable } from '@nestjs/common';
import * as forumPostRepository from '../../domain/repositories/forum-post.repository';
import { ForumPost } from '../../domain/entities/forum-post.entity';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class CreatePostUseCase {
  constructor(
    @Inject(forumPostRepository.FORUM_POST_REPOSITORY)
    private forumRepo: forumPostRepository.IForumPostRepository,
  ) {}

  async execute(
    authorId: string,
    title: string,
    content: string,
  ): Promise<ForumPost> {
    const post = new ForumPost(uuidv4(), authorId, title, content);
    return this.forumRepo.save(post);
  }
}
