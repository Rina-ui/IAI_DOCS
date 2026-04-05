import * as examRepository from '../../domain/repositories/exam.repository';
import * as trainingRepository from '../../domain/repositories/training.repository';
import { Training } from '../../domain/entities/ttraining.entity';
export declare class StartTrainingUseCase {
    private examRepo;
    private trainingRepo;
    constructor(examRepo: examRepository.IExamRepository, trainingRepo: trainingRepository.ITrainingRepository);
    execute(studentId: string, examId: string): Promise<Training>;
}
