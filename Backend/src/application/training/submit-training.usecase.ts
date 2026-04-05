import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as trainingRepository from '../../domain/repositories/training.repository';
import * as questionRepository from '../../domain/repositories/question.repository';
import * as correctionRepository from '../../domain/repositories/correction.repository';
import { Correction } from '../../domain/entities/correction.entity';
import { AiService } from '../../infrastructure/ai/ai.service';
import { v4 as uuidv4 } from 'uuid';

export interface SubmitAnswerDto {
  questionId: string;
  answer: string;
}

@Injectable()
export class SubmitTrainingUseCase {
  constructor(
    @Inject(trainingRepository.TRAINING_REPOSITORY)
    private trainingRepo: trainingRepository.ITrainingRepository,
    @Inject(questionRepository.QUESTION_REPOSITORY)
    private questionRepo: questionRepository.IQuestionRepository,
    @Inject(correctionRepository.CORRECTION_REPOSITORY)
    private correctionRepo: correctionRepository.ICorrectionRepository,
    private aiService: AiService,
  ) {}

  async execute(
    trainingId: string,
    answers: SubmitAnswerDto[],
  ): Promise<Correction> {
    const training = await this.trainingRepo.findById(trainingId);
    if (!training) throw new NotFoundException('Training not found');
    if (training.isCompleted())
      throw new BadRequestException('Training already submitted');

    const questions = await this.questionRepo.findByExam(training.examId);
    if (!questions.length)
      throw new BadRequestException('No questions found for this exam');

    // Calcul du score
    let totalScore = 0;
    const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
    const aiInput: any[] = [];

    for (const answer of answers) {
      const question = questions.find((q) => q.id === answer.questionId);
      if (!question) continue;
      const isCorrect = question.evaluate(answer.answer);
      if (isCorrect) totalScore += question.points;
      aiInput.push({
        text: question.questionText,
        correct: question.correctAnswer,
        given: answer.answer,
        points: question.points,
      });
    }

    const percentage =
      maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;

    // Correction IA
    const aiResult = await this.aiService.generateCorrection(
      aiInput,
      totalScore,
      maxScore,
    );

    // Mise à jour training
    training.submit(totalScore);
    await this.trainingRepo.save(training);

    // Sauvegarde correction
    const correction = new Correction(
      uuidv4(),
      trainingId,
      totalScore,
      percentage,
      aiResult.explanation,
    );
    return this.correctionRepo.save(correction);
  }
}
