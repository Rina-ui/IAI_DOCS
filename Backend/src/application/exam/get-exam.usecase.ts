import { Inject, Injectable } from '@nestjs/common';
import * as examRepository from '../../domain/repositories/exam.repository';

@Injectable()
export class GetExamsUseCase {
  constructor(
    @Inject(examRepository.EXAM_REPOSITORY)
    private examRepo: examRepository.IExamRepository,
  ) {}

  async execute(filters?: { level?: string; subject?: string }) {
    return this.examRepo.findAll(filters);
  }
}
