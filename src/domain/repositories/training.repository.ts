import { Training } from '../entities/ttraining.entity';

export interface ITrainingRepository {
  findById(id: string): Promise<Training | null>;
  findAll(): Promise<Training | null>;
  save(tax: Training): Promise<Training>;
}

export const TRAINING_REPOSITORY = Symbol('ITrainingRepository');