import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExamRepository, ExamFilters } from '../../../domain/repositories/exam.repository';
import { Exam, ExamStatus } from '../../../domain/entities/exam.entity';
import { ExamOrmEntity } from '../entities/exam.orm-entity';

@Injectable()
export class ExamTypeOrmRepository implements IExamRepository {
  constructor(
      @InjectRepository(ExamOrmEntity)
      private readonly repo: Repository<ExamOrmEntity>,
  ) {}

  findByTitle(title: string): Promise<Exam | null> {
        throw new Error("Method not implemented.");
    }

  async findById(id: string): Promise<Exam | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findAll(filters?: ExamFilters): Promise<Exam[]> {
    const query = this.repo.createQueryBuilder('exam')
        .where('exam.status = :status', { status: 'validated' });

    if (filters?.filiere) query.andWhere('exam.filiere = :filiere', { filiere: filters.filiere });
    if (filters?.subject) query.andWhere('exam.subject ILIKE :subject', { subject: `%${filters.subject}%` });
    if (filters?.subjectId) query.andWhere('exam.subjectId = :subjectId', { subjectId: filters.subjectId });
    if (filters?.level) query.andWhere('exam.level = :level', { level: filters.level });
    if (filters?.year) query.andWhere('exam.year = :year', { year: filters.year });

    query.orderBy('exam.year', 'DESC');
    const list = await query.getMany();
    return list.map(this.toDomain.bind(this));
  }

  async findPending(): Promise<Exam[]> {
    const list = await this.repo.find({ where: { status: 'pending' } });
    return list.map(this.toDomain.bind(this));
  }

  async save(exam: Exam): Promise<Exam> {
    const saved = await this.repo.save(this.toOrm(exam));
    return this.toDomain(saved);
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id);
  }

  private toDomain(orm: ExamOrmEntity): Exam {
    return new Exam(
        orm.id, orm.title, orm.subject, orm.year,
        orm.level, orm.filiere, orm.fileUrl,
        orm.uploadedById, orm.status as ExamStatus, orm.subjectId,
    );
  }

  private toOrm(exam: Exam): ExamOrmEntity {
    const orm = new ExamOrmEntity();
    Object.assign(orm, {
      id: exam.id, title: exam.title, subject: exam.subject,
      year: exam.year, level: exam.level, filiere: exam.filiere,
      fileUrl: exam.fileUrl, uploadedById: exam.uploadedById,
      status: exam.status, subjectId: exam.subjectId,
    });
    return orm;
  }
}