import {
  Inject,
  Injectable,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import * as examRepository from '../../domain/repositories/exam.repository';
import * as trainingRepository from '../../domain/repositories/training.repository';
import { Training } from '../../domain/entities/ttraining.entity';
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
    if (!exam) throw new NotFoundException('Exam not found');
    // eslint-disable-next-line @typescript-eslint/no-unsafe-call
    if (!exam.isAvailableForTraining())
      throw new BadRequestException('Exam not yet validated');

    const training = new Training(uuidv4(), studentId, examId);
    return this.trainingRepo.save(training);
  }
}
