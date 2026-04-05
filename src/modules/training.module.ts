import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { StartTrainingUseCase } from '../application/training/start-training.usecase';
import { SubmitTrainingUseCase } from '../application/training/submit-training.usecase';
import { GetCorrectionUseCase } from '../application/training/get-correction.usecase';
import { TrainingOrmEntity } from '../infrastructure/database/entities/training.orm-entity';
import { CorrectionOrmEntity } from '../infrastructure/database/entities/correction.orm-entity';
import { TrainingTypeOrmRepository } from '../infrastructure/database/repositories/training.typeorm-repository';
import { CorrectionTypeOrmRepository } from '../infrastructure/database/repositories/correction.typeorm-repository';
import { TrainingController } from '../infrastructure/http/controllers/training.controller';
import { AiService } from '../infrastructure/ai/ai.service';
import { TRAINING_REPOSITORY } from '../domain/repositories/training.repository';
import { CORRECTION_REPOSITORY } from '../domain/repositories/correction.repository';
import { ExamModule } from './exam.module';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TrainingOrmEntity, CorrectionOrmEntity]),
    ExamModule,
    AuthModule,
  ],
  controllers: [TrainingController],
  providers: [
    StartTrainingUseCase,
    SubmitTrainingUseCase,
    GetCorrectionUseCase,
    AiService,
    { provide: TRAINING_REPOSITORY, useClass: TrainingTypeOrmRepository },
    { provide: CORRECTION_REPOSITORY, useClass: CorrectionTypeOrmRepository },
  ],
})
export class TrainingModule {}
