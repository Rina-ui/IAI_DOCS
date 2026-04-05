import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreatePostUseCase } from '../application/forum/create-post.usecase';
import { UpvotePostUseCase } from '../application/forum/upvote-post.usecase';
import { ForumPostOrmEntity } from '../infrastructure/database/entities/forum-post.orm-entity';
import { ForumPostTypeOrmRepository } from '../infrastructure/database/repositories/forum-post.typeorm-repository';
import { ForumController } from '../infrastructure/http/controllers/forum.controller';
import { FORUM_POST_REPOSITORY } from '../domain/repositories/forum-post.repository';
import { AuthModule } from './auth.module';

@Module({
  imports: [TypeOrmModule.forFeature([ForumPostOrmEntity]), AuthModule],
  controllers: [ForumController],
  providers: [
    CreatePostUseCase,
    UpvotePostUseCase,
    { provide: FORUM_POST_REPOSITORY, useClass: ForumPostTypeOrmRepository },
  ],
})
export class ForumModule {}
