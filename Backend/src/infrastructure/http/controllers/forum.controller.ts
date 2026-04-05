import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreatePostUseCase } from '../../../application/forum/create-post.usecase';
import { UpvotePostUseCase } from '../../../application/forum/upvote-post.usecase';
import * as forumPostRepository from '../../../domain/repositories/forum-post.repository';

@ApiTags('Forum')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('forum')
export class ForumController {
  constructor(
      private createPost: CreatePostUseCase,
      private upvotePost: UpvotePostUseCase,
      @Inject(forumPostRepository.FORUM_POST_REPOSITORY) private forumRepo: forumPostRepository.IForumPostRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les posts du forum' })
  @ApiResponse({ status: 200, description: 'Liste des posts triés par date' })
  findAll() {
    return this.forumRepo.findAll();
  }

  @Post()
  @ApiOperation({ summary: 'Créer un post dans le forum' })
  @ApiBody({
    schema: {
      example: { title: 'Question sur le Bac 2023', content: 'Est-ce que quelqu\'un peut m\'expliquer l\'exercice 3 ?' },
    },
  })
  @ApiResponse({ status: 201, description: 'Post créé' })
  create(@Body() body: { title: string; content: string }, @CurrentUser() user: any) {
    return this.createPost.execute(user.id, body.title, body.content);
  }

  @Patch(':id/upvote')
  @ApiOperation({ summary: 'Upvoter un post' })
  @ApiParam({ name: 'id', description: 'UUID du post' })
  @ApiResponse({ status: 200, description: 'Upvote enregistré' })
  upvote(@Param('id') id: string) {
    return this.upvotePost.execute(id);
  }
}