import { StartTrainingUseCase } from '../../../application/training/start-training.usecase';
import { SubmitTrainingUseCase } from '../../../application/training/submit-training.usecase';
import { GetCorrectionUseCase } from '../../../application/training/get-correction.usecase';
export declare class TrainingController {
    private startTraining;
    private submitTraining;
    private getCorrection;
    constructor(startTraining: StartTrainingUseCase, submitTraining: SubmitTrainingUseCase, getCorrection: GetCorrectionUseCase);
    start(examId: string, user: any): Promise<import("../../../domain/entities/ttraining.entity").Training>;
    submit(id: string, answers: any[]): Promise<import("../../../domain/entities/correction.entity").Correction>;
    correction(id: string): Promise<import("../../../domain/entities/correction.entity").Correction>;
}
