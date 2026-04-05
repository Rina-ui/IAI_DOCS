import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UploadExamUseCase } from '../application/exam/upload-exam.usecase';
import { ValidateExamUseCase } from '../application/exam/validate-exam.usecase';
import { GetExamsUseCase } from '../application/exam/get-exam.usecase';
import { ExamOrmEntity } from '../infrastructure/database/entities/exam.orm-entity';
import { QuestionOrmEntity } from '../infrastructure/database/entities/question.orm-entity';
import { ExamTypeOrmRepository } from '../infrastructure/database/repositories/exam.typeorm-repository';
import { QuestionTypeOrmRepository } from '../infrastructure/database/repositories/question.typeorm-repository';
import { ExamController } from '../infrastructure/http/controllers/exam.controller';
import { EXAM_REPOSITORY } from '../domain/repositories/exam.repository';
import { QUESTION_REPOSITORY } from '../domain/repositories/question.repository';
import { CloudinaryService } from '../infrastructure/storage/cloudinary.service';
import { AuthModule } from './auth.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([ExamOrmEntity, QuestionOrmEntity]),
    AuthModule,
  ],
  controllers: [ExamController],
  providers: [
    UploadExamUseCase,
    ValidateExamUseCase,
    GetExamsUseCase,
    CloudinaryService,
    { provide: EXAM_REPOSITORY, useClass: ExamTypeOrmRepository },
    { provide: QUESTION_REPOSITORY, useClass: QuestionTypeOrmRepository },
  ],
  exports: [EXAM_REPOSITORY, QUESTION_REPOSITORY],
})
export class ExamModule {}
