import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as trainingRepository from '../../domain/repositories/training.repository';
import * as questionRepository from '../../domain/repositories/question.repository';
import * as correctionRepository from '../../domain/repositories/correction.repository';
import {AiService} from '../../infrastructure/ai/ai.service';

@Injectable()
export class LearningSummaryUseCase {
    constructor(
        @Inject(trainingRepository.TRAINING_REPOSITORY) private trainingRepo: trainingRepository.ITrainingRepository,
        @Inject(questionRepository.QUESTION_REPOSITORY) private questionRepo: questionRepository.IQuestionRepository,
        @Inject(correctionRepository.CORRECTION_REPOSITORY) private correctionRepo: correctionRepository.ICorrectionRepository,
        private aiService: AiService,
    ) {}

    async execute(trainingId: string) {
        const training = await this.trainingRepo.findById(trainingId);
        if (!training) throw new NotFoundException('Training not found');

        const correction = await this.correctionRepo.findByTraining(trainingId);
        const questions = await this.questionRepo.findByExam(training.examId);
        const maxScore = questions.reduce((sum, q) => sum + q.points, 0);

        const summary = await this.aiService.generateLearningSummary(
            training.score,
            maxScore,
            questions.map(q => ({ text: q.questionText, points: q.points })),
        );

        return {
            trainingId,
            score: training.score,
            maxScore,
            percentage: maxScore > 0 ? Math.round((training.score / maxScore) * 100) : 0,
            completedAt: training.submittedAt,
            aiSummary: summary,
            correction: correction || null,
        };
    }
}