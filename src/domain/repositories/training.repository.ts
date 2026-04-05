import { Training } from '../entities/ttraining.entity';

export interface ITrainingRepository {
  findById(id: string): Promise<Training | null>;
  save(tax: Training): Promise<Training>;
  findByStudent(studentId: string): Promise<Training[]>;
}

export const TRAINING_REPOSITORY = Symbol('ITrainingRepository');