import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IForumPostRepository } from '../../../domain/repositories/forum-post.repository';
import { ForumPost } from '../../../domain/entities/forum-post.entity';
import { ForumPostOrmEntity } from '../entities/forum-post.orm-entity';

@Injectable()
export class ForumPostTypeOrmRepository implements IForumPostRepository {
  constructor(
    @InjectRepository(ForumPostOrmEntity)
    private readonly repo: Repository<ForumPostOrmEntity>,
  ) {}

  async findAll(): Promise<ForumPost[]> {
    const list = await this.repo.find({ order: { createdAt: 'DESC' } });
    return list.map(this.toDomain);
  }

  async findById(id: string): Promise<ForumPost | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(post: ForumPost): Promise<ForumPost> {
    const saved = await this.repo.save(this.toOrm(post));
    return this.toDomain(saved);
  }

  private toDomain(orm: ForumPostOrmEntity): ForumPost {
    return new ForumPost(
      orm.id,
      orm.authorId,
      orm.title,
      orm.content,
      orm.upvotes,
      orm.createdAt,
    );
  }

  private toOrm(p: ForumPost): ForumPostOrmEntity {
    const orm = new ForumPostOrmEntity();
    Object.assign(orm, {
      id: p.id,
      authorId: p.authorId,
      title: p.title,
      content: p.content,
      upvotes: p.upvotes,
    });
    return orm;
  }
}
