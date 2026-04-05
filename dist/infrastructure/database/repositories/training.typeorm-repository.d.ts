import { Repository } from 'typeorm';
import { ITrainingRepository } from '../../../domain/repositories/training.repository';
import { Training } from '../../../domain/entities/ttraining.entity';
import { TrainingOrmEntity } from '../entities/training.orm-entity';
export declare class TrainingTypeOrmRepository implements ITrainingRepository {
    private readonly repo;
    constructor(repo: Repository<TrainingOrmEntity>);
    findById(id: string): Promise<Training | null>;
    findByStudent(studentId: string): Promise<Training[]>;
    save(training: Training): Promise<Training>;
    private toDomain;
    private toOrm;
}
