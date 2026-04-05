import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ICorrectionRepository } from '../../../domain/repositories/correction.repository';
import { Correction } from '../../../domain/entities/correction.entity';
import { CorrectionOrmEntity } from '../entities/correction.orm-entity';

@Injectable()
export class CorrectionTypeOrmRepository implements ICorrectionRepository {
  constructor(
    @InjectRepository(CorrectionOrmEntity)
    private readonly repo: Repository<CorrectionOrmEntity>,
  ) {}

  async findByTraining(trainingId: string): Promise<Correction | null> {
    const orm = await this.repo.findOne({ where: { trainingId } });
    return orm ? this.toDomain(orm) : null;
  }

  async save(correction: Correction): Promise<Correction> {
    const saved = await this.repo.save(this.toOrm(correction));
    return this.toDomain(saved);
  }

  private toDomain(orm: CorrectionOrmEntity): Correction {
    return new Correction(
      orm.id,
      orm.trainingId,
      orm.totalScore,
      orm.percentage,
      orm.aiExplanation,
      orm.generatedAt,
    );
  }

  private toOrm(c: Correction): CorrectionOrmEntity {
    const orm = new CorrectionOrmEntity();
    Object.assign(orm, {
      id: c.id,
      trainingId: c.trainingId,
      totalScore: c.totalScore,
      percentage: c.percentage,
      aiExplanation: c.aiExplanation,
    });
    return orm;
  }
}
