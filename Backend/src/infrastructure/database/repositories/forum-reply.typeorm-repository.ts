import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IForumReplyRepository } from '../../../domain/repositories/forum-reply.repository';
import { ForumReply } from '../../../domain/entities/forum-reply.entity';
import { ForumReplyOrmEntity } from '../entities/forum-reply.orm-entity';

@Injectable()
export class ForumReplyTypeOrmRepository implements IForumReplyRepository {
    constructor(
        @InjectRepository(ForumReplyOrmEntity)
        private readonly repo: Repository<ForumReplyOrmEntity>,
    ) {}

    async findByPost(postId: string): Promise<ForumReply[]> {
        const list = await this.repo.find({
            where: { postId },
            order: { upvotes: 'DESC', createdAt: 'ASC' },
        });
        return list.map(this.toDomain);
    }

    async findById(id: string): Promise<ForumReply | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }

    async save(reply: ForumReply): Promise<ForumReply> {
        const saved = await this.repo.save(this.toOrm(reply));
        return this.toDomain(saved);
    }

    private toDomain(orm: ForumReplyOrmEntity): ForumReply {
        return new ForumReply(orm.id, orm.postId, orm.authorId, orm.content, orm.upvotes, orm.createdAt);
    }

    private toOrm(r: ForumReply): ForumReplyOrmEntity {
        const orm = new ForumReplyOrmEntity();
        Object.assign(orm, { id: r.id, postId: r.postId, authorId: r.authorId, content: r.content, upvotes: r.upvotes });
        return orm;
    }
}