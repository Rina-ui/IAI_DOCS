import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, IsNull, MoreThan } from 'typeorm';
import { IAnnouncementRepository } from '../../../domain/repositories/announcement.repository';
import { Announcement, AnnouncementType } from '../../../domain/entities/announcement.entity';
import { AnnouncementOrmEntity } from '../entities/announcement.orm-entity';

@Injectable()
export class AnnouncementTypeOrmRepository implements IAnnouncementRepository {
    constructor(
        @InjectRepository(AnnouncementOrmEntity)
        private readonly repo: Repository<AnnouncementOrmEntity>,
    ) {}

    async findAll(): Promise<Announcement[]> {
        const list = await this.repo.find({ order: { createdAt: 'DESC' } });
        return list.map(this.toDomain);
    }

    async findActive(): Promise<Announcement[]> {
        // Annonces sans date d'expiration OU dont la date n'est pas encore passée
        const list = await this.repo.createQueryBuilder('a')
            .where('a.expiresAt IS NULL OR a.expiresAt > :now', { now: new Date() })
            .orderBy('a.createdAt', 'DESC')
            .getMany();
        return list.map(this.toDomain);
    }

    async findById(id: string): Promise<Announcement | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }

    async save(a: Announcement): Promise<Announcement> {
        const saved = await this.repo.save(this.toOrm(a));
        return this.toDomain(saved);
    }

    async delete(id: string): Promise<void> {
        await this.repo.delete(id);
    }

    private toDomain(orm: AnnouncementOrmEntity): Announcement {
        return new Announcement(
            orm.id, orm.title, orm.content,
            orm.type as AnnouncementType, orm.authorId,
            orm.createdAt, orm.expiresAt,
            orm.imageUrl,
        );
    }

    private toOrm(a: Announcement): AnnouncementOrmEntity {
        const orm = new AnnouncementOrmEntity();
        Object.assign(orm, {
            id: a.id, title: a.title, content: a.content,
            type: a.type, authorId: a.authorId,
            expiresAt: a.expiresAt,
            imageUrl: a.imageUrl,
        });
        return orm;
    }
}