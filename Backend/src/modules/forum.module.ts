import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePostUseCase } from '../application/forum/create-post.usecase';
import { UpvotePostUseCase } from '../application/forum/upvote-post.usecase';
import { ReplyPostUseCase } from '../application/forum/reply-post.usecase';
import { UpvoteReplyUseCase } from '../application/forum/upvote-reply.usecase';
import { ForumPostOrmEntity } from '../infrastructure/database/entities/forum-post.orm-entity';
import { ForumReplyOrmEntity } from '../infrastructure/database/entities/forum-reply.orm-entity';
import { ForumPostTypeOrmRepository } from '../infrastructure/database/repositories/forum-post.typeorm-repository';
import { ForumReplyTypeOrmRepository } from '../infrastructure/database/repositories/forum-reply.typeorm-repository';
import { ForumController } from '../infrastructure/http/controllers/forum.controller';
import { FORUM_POST_REPOSITORY } from '../domain/repositories/forum-post.repository';
import { FORUM_REPLY_REPOSITORY } from '../domain/repositories/forum-reply.repository';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ForumPostOrmEntity, ForumReplyOrmEntity]),
    AuthModule,
  ],
  controllers: [ForumController],
  providers: [
    CreatePostUseCase,
    UpvotePostUseCase,
    ReplyPostUseCase,
    UpvoteReplyUseCase,
    { provide: FORUM_POST_REPOSITORY, useClass: ForumPostTypeOrmRepository },
    { provide: FORUM_REPLY_REPOSITORY, useClass: ForumReplyTypeOrmRepository },
  ],
})
export class ForumModule {}