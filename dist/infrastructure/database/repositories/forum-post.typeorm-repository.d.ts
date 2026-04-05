import { Repository } from 'typeorm';
import { IForumPostRepository } from '../../../domain/repositories/forum-post.repository';
import { ForumPost } from '../../../domain/entities/forum-post.entity';
import { ForumPostOrmEntity } from '../entities/forum-post.orm-entity';
export declare class ForumPostTypeOrmRepository implements IForumPostRepository {
    private readonly repo;
    constructor(repo: Repository<ForumPostOrmEntity>);
    findAll(): Promise<ForumPost[]>;
    findById(id: string): Promise<ForumPost | null>;
    save(post: ForumPost): Promise<ForumPost>;
    private toDomain;
    private toOrm;
}
