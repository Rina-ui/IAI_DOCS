import { Correction } from '../entities/correction.entity';

export interface ICorrectionRepository {
  findByTraining(trainingId: string): Promise<Correction | null>;
  save(correction: Correction): Promise<Correction>;
}
export const CORRECTION_REPOSITORY = Symbol('ICorrectionRepository');
