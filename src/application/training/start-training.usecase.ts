import { Inject, Injectable } from '@nestjs/common';
import * as examRepository from '../../domain/repositories/exam.repository';
import { Training } from '../../domain/entities/ttraining.entity';
import * as trainingRepository from '../../domain/repositories/training.repository';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class StartTrainingUseCase {
  constructor(
    @Inject(examRepository.EXAM_REPOSITORY)
    private examRepo: examRepository.IExamRepository,
    @Inject(trainingRepository.TRAINING_REPOSITORY)
    private trainingRepo: trainingRepository.ITrainingRepository,
  ) {}

  async execute(studentId: string, examId: string): Promise<Training> {
    const exam = await this.examRepo.findById(examId);
    if (!exam) throw new Error('Exam not found');

    if (!exam.isAvalaibleForTraining()) {
      throw new Error('This exam is not yet validated');
    }

    const training = new Training(uuidv4(), studentId, examId);
    // eslint-disable-next-line @typescript-eslint/no-unsafe-return,@typescript-eslint/no-unsafe-call
    return this.trainingRepo.save(training);
  }
}
