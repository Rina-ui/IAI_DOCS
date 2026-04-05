import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { IExamRepository } from '../../../domain/repositories/exam.repository';
import { Exam, ExamStatus } from '../../../domain/entities/exam.entity';
import { ExamOrmEntity } from '../entities/exam.orm-entity';

@Injectable()
export class ExamTypeOrmRepository implements IExamRepository {
  constructor(
    @InjectRepository(ExamOrmEntity)
    private readonly repo: Repository<ExamOrmEntity>,
  ) {}

  async findById(id: string): Promise<Exam | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  // @ts-ignore
  async findAll(filters?: {
    level?: string;
    subject?: string;
  }): Promise<Exam[]> {
    const where: any = { status: 'validated' };
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (filters?.level) where.level = filters.level;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
    if (filters?.subject) where.subject = filters.subject;
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    const list = await this.repo.find({ where });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return list.map(this.toDomain);
  }

  async findPending(): Promise<Exam[]> {
    const list = await this.repo.find({ where: { status: 'pending' } });
    // eslint-disable-next-line @typescript-eslint/unbound-method
    return list.map(this.toDomain);
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
      orm.id,
      orm.title,
      orm.subject,
      orm.year,
      orm.level,
      orm.fileUrl,
      orm.uploadedById,
      orm.status as ExamStatus,
    );
  }

  private toOrm(exam: Exam): ExamOrmEntity {
    const orm = new ExamOrmEntity();
    Object.assign(orm, {
      id: exam.id,
      title: exam.title,
      subject: exam.subject,
      year: exam.year,
      level: exam.level,
      fileUrl: exam.fileUrl,
      uploadedById: exam.uploadedById,
      status: exam.status,
    });
    return orm;
  }
}
