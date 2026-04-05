import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ITrainingRepository } from '../../../domain/repositories/training.repository';
import { Training } from '../../../domain/entities/ttraining.entity';
import { TrainingOrmEntity } from '../entities/training.orm-entity';

@Injectable()
export class TrainingTypeOrmRepository implements ITrainingRepository {
  constructor(
    @InjectRepository(TrainingOrmEntity)
    private readonly repo: Repository<TrainingOrmEntity>,
  ) {}

  async findById(id: string): Promise<Training | null> {
    const orm = await this.repo.findOne({ where: { id } });
    return orm ? this.toDomain(orm) : null;
  }

  async findByStudent(studentId: string): Promise<Training[]> {
    const list = await this.repo.find({ where: { studentId } });
    return list.map(this.toDomain.bind(this));
  }

  async save(training: Training): Promise<Training> {
    const saved = await this.repo.save(this.toOrm(training));
    return this.toDomain(saved);
  }

  private toDomain(orm: TrainingOrmEntity): Training {
    const t = new Training(
      orm.id,
      orm.studentId,
      orm.examId,
      orm.score,
      orm.startedAt,
    );
    if (orm.submittedAt) t.submittedAt = orm.submittedAt;
    return t;
  }

  private toOrm(t: Training): TrainingOrmEntity {
    const orm = new TrainingOrmEntity();
    Object.assign(orm, {
      id: t.id,
      studentId: t.studentId,
      examId: t.examId,
      score: t.score,
      startedAt: t.startedAt,
      submittedAt: t.submittedAt,
    });
    return orm;
  }
}
