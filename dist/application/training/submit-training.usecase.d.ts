import * as trainingRepository from '../../domain/repositories/training.repository';
import * as questionRepository from '../../domain/repositories/question.repository';
import * as correctionRepository from '../../domain/repositories/correction.repository';
import { Correction } from '../../domain/entities/correction.entity';
import { AiService } from '../../infrastructure/ai/ai.service';
export interface SubmitAnswerDto {
    questionId: string;
    answer: string;
}
export declare class SubmitTrainingUseCase {
    private trainingRepo;
    private questionRepo;
    private correctionRepo;
    private aiService;
    constructor(trainingRepo: trainingRepository.ITrainingRepository, questionRepo: questionRepository.IQuestionRepository, correctionRepo: correctionRepository.ICorrectionRepository, aiService: AiService);
    execute(trainingId: string, answers: SubmitAnswerDto[]): Promise<Correction>;
}
