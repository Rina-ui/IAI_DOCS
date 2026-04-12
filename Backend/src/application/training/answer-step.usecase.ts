import { Inject, Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import * as trainingRepository from '../../domain/repositories/training.repository';
import * as questionRepository from '../../domain/repositories/question.repository';
import {AiService} from '../../infrastructure/ai/ai.service';

export interface StepFeedback {
    questionId: string;
    questionText: string;
    givenAnswer: string;
    correctAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    explanation: string;
    tip: string;
    resourceToReview: string;
}

@Injectable()
export class AnswerStepUseCase {
    constructor(
        @Inject(trainingRepository.TRAINING_REPOSITORY) private trainingRepo: trainingRepository.ITrainingRepository,
        @Inject(questionRepository.QUESTION_REPOSITORY) private questionRepo: questionRepository.IQuestionRepository,
        private aiService: AiService,
    ) {}

    async execute(trainingId: string, questionId: string, answer: string): Promise<StepFeedback> {
        const training = await this.trainingRepo.findById(trainingId);
        if (!training) throw new NotFoundException('Training not found');
        if (training.isCompleted()) throw new BadRequestException('Training already submitted');

        const question = await this.questionRepo.findById(questionId);
        if (!question) throw new NotFoundException('Question not found');
        if (question.examId !== training.examId) throw new BadRequestException('Question does not belong to this exam');

        const isCorrect = question.evaluate(answer);
        const pointsEarned = isCorrect ? question.points : 0;

        // Gemini génère un feedback immédiat et personnalisé
        const feedback = await this.aiService.generateStepFeedback(
            question.questionText,
            question.correctAnswer,
            answer,
            isCorrect,
            question.explanation,
        );

        return {
            questionId,
            questionText: question.questionText,
            givenAnswer: answer,
            correctAnswer: question.correctAnswer,
            isCorrect,
            pointsEarned,
            explanation: feedback.explanation,
            tip: feedback.tip,
            resourceToReview: feedback.resourceToReview,
        };
    }
}