import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreatePostUseCase } from '../../../application/forum/create-post.usecase';
import { UpvotePostUseCase } from '../../../application/forum/upvote-post.usecase';
import * as forumPostRepository from '../../../domain/repositories/forum-post.repository';
import { Inject } from '@nestjs/common';

@Controller('forum')
@UseGuards(JwtAuthGuard)
export class ForumController {
  constructor(
    private createPost: CreatePostUseCase,
    private upvotePost: UpvotePostUseCase,
    @Inject(forumPostRepository.FORUM_POST_REPOSITORY)
    private forumRepo: forumPostRepository.IForumPostRepository,
  ) {}

  @Get()
  findAll() {
    return this.forumRepo.findAll();
  }

  @Post()
  create(
    @Body() body: { title: string; content: string },
    @CurrentUser() user: any,
  ) {
    return this.createPost.execute(user.id, body.title, body.content);
  }

  @Patch(':id/upvote')
  upvote(@Param('id') id: string) {
    return this.upvotePost.execute(id);
  }
}
