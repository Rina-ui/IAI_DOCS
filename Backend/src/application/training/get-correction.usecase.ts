import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as correctionRepository from '../../domain/repositories/correction.repository';

@Injectable()
export class GetCorrectionUseCase {
  constructor(
    @Inject(correctionRepository.CORRECTION_REPOSITORY)
    private correctionRepo: correctionRepository.ICorrectionRepository,
  ) {}

  async execute(trainingId: string) {
    const correction = await this.correctionRepo.findByTraining(trainingId);
    if (!correction) throw new NotFoundException('Correction not found');
    return correction;
  }
}
