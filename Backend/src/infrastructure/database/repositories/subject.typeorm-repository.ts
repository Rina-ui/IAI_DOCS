import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ISubjectRepository } from '../../../domain/repositories/subject.repository';
import { Subject } from '../../../domain/entities/subject.entity';
import { SubjectOrmEntity } from '../entities/subject.orm-entity';

@Injectable()
export class SubjectTypeOrmRepository implements ISubjectRepository {
    constructor(
        @InjectRepository(SubjectOrmEntity)
        private readonly repo: Repository<SubjectOrmEntity>,
    ) {}

    async findAll(): Promise<Subject[]> {
        const list = await this.repo.find({ order: { filiere: 'ASC', name: 'ASC' } });
        return list.map(this.toDomain);
    }

    async findByFiliere(filiere: string): Promise<Subject[]> {
        const list = await this.repo.find({
            where: [
                { filiere },
                { filiere: 'COMMUN' }, 
            ],
            order: { name: 'ASC' },
        });
        return list.map(this.toDomain);
    }

    async findById(id: string): Promise<Subject | null> {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }

    private toDomain(orm: SubjectOrmEntity): Subject {
        return new Subject(orm.id, orm.name, orm.filiere as any, orm.description);
    }
}