import { Correction } from '../entities/correction.entity';
export interface ICorrectionRepository {
    findByTraining(trainingId: string): Promise<Correction | null>;
    save(correction: Correction): Promise<Correction>;
}
export declare const CORRECTION_REPOSITORY: unique symbol;
