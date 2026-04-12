import { Body, Controller, Get, Inject, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth, ApiParam, ApiBody } from '@nestjs/swagger';
import { JwtAuthGuard } from '../guards/jwt.guard';
import { CurrentUser } from '../decorators/current-user.decorator';
import { CreatePostUseCase } from '../../../application/forum/create-post.usecase';
import { UpvotePostUseCase } from '../../../application/forum/upvote-post.usecase';
import { ReplyPostUseCase } from '../../../application/forum/reply-post.usecase';
import { UpvoteReplyUseCase } from '../../../application/forum/upvote-reply.usecase';
import * as forumPostRepository from '../../../domain/repositories/forum-post.repository';
import * as forumReplyRepository from '../../../domain/repositories/forum-reply.repository';

@ApiTags('Forum')
@ApiBearerAuth('JWT-auth')
@UseGuards(JwtAuthGuard)
@Controller('forum')
export class ForumController {
  constructor(
      private createPost: CreatePostUseCase,
      private upvotePost: UpvotePostUseCase,
      private replyPost: ReplyPostUseCase,
      private upvoteReply: UpvoteReplyUseCase,
      @Inject(forumPostRepository.FORUM_POST_REPOSITORY) private forumRepo: forumPostRepository.IForumPostRepository,
      @Inject(forumReplyRepository.FORUM_REPLY_REPOSITORY) private replyRepo: forumReplyRepository.IForumReplyRepository,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Lister tous les posts du forum' })
  @ApiResponse({ status: 200, description: 'Liste des posts triés par date' })
  findAll() {
    return this.forumRepo.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: 'Voir un post avec toutes ses réponses' })
  @ApiParam({ name: 'id', description: 'UUID du post' })
  async findOne(@Param('id') id: string) {
    const post = await this.forumRepo.findById(id);
    const replies = await this.replyRepo.findByPost(id);
    return { ...post, replies };
  }

  @Post()
  @ApiOperation({ summary: 'Créer un post dans le forum' })
  @ApiBody({
    schema: {
      example: {
        title: 'Question sur le Bac 2023',
        content: 'Est-ce que quelqu\'un peut m\'expliquer l\'exercice 3 ?',
      },
    },
  })
  @ApiResponse({ status: 201, description: 'Post créé' })
  create(@Body() body: { title: string; content: string }, @CurrentUser() user: any) {
    return this.createPost.execute(user.id, body.title, body.content);
  }

  @Post(':id/replies')
  @ApiOperation({ summary: 'Répondre à un post' })
  @ApiParam({ name: 'id', description: 'UUID du post' })
  @ApiBody({
    schema: {
      example: { content: 'Pour résoudre cet exercice, il faut d\'abord...' },
    },
  })
  @ApiResponse({ status: 201, description: 'Réponse ajoutée' })
  reply(
      @Param('id') postId: string,
      @Body('content') content: string,
      @CurrentUser() user: any,
  ) {
    return this.replyPost.execute(postId, user.id, content);
  }

  @Patch(':id/upvote')
  @ApiOperation({ summary: 'Upvoter un post' })
  @ApiParam({ name: 'id', description: 'UUID du post' })
  upvotePostHandler(@Param('id') id: string) {
    return this.upvotePost.execute(id);
  }

  @Patch('replies/:id/upvote')
  @ApiOperation({ summary: 'Upvoter une réponse' })
  @ApiParam({ name: 'id', description: 'UUID de la réponse' })
  upvoteReplyHandler(@Param('id') id: string) {
    return this.upvoteReply.execute(id);
  }
}