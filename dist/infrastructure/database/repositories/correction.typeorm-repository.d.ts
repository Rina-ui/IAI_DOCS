import { Repository } from 'typeorm';
import { ICorrectionRepository } from '../../../domain/repositories/correction.repository';
import { Correction } from '../../../domain/entities/correction.entity';
import { CorrectionOrmEntity } from '../entities/correction.orm-entity';
export declare class CorrectionTypeOrmRepository implements ICorrectionRepository {
    private readonly repo;
    constructor(repo: Repository<CorrectionOrmEntity>);
    findByTraining(trainingId: string): Promise<Correction | null>;
    save(correction: Correction): Promise<Correction>;
    private toDomain;
    private toOrm;
}
