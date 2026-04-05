import {
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import * as examRepository from '../../domain/repositories/exam.repository';
import { Exam } from '../../domain/entities/exam.entity';

@Injectable()
export class ValidateExamUseCase {
  constructor(
    @Inject(examRepository.EXAM_REPOSITORY)
    private examRepo: examRepository.IExamRepository,
  ) {}

  async execute(examId: string, teacherId: string): Promise<Exam> {
    const exam = await this.examRepo.findById(examId);
    if (!exam) throw new NotFoundException('Exam not found');

    exam.validate(); 
    return this.examRepo.save(exam);
  }
}
