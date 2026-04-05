import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import * as examRepository from '../../domain/repositories/exam.repository';
import * as questionRepository from '../../domain/repositories/question.repository';
import { Exam } from '../../domain/entities/exam.entity';
import { Question } from '../../domain/entities/question.entity';
import { v4 as uuidv4 } from 'uuid';

export interface UploadExamDto {
  title: string;
  subject: string;
  year: number;
  level: string;
  fileUrl: string;
  uploadedById: string;
  questions?: {
    questionText: string;
    points: number;
    correctAnswer: string;
    explanation: string;
  }[];
}

@Injectable()
export class UploadExamUseCase {
  constructor(
    @Inject(examRepository.EXAM_REPOSITORY)
    private examRepo: examRepository.IExamRepository,
    @Inject(questionRepository.QUESTION_REPOSITORY)
    private questionRepo: questionRepository.IQuestionRepository,
  ) {}

  async execute(dto: UploadExamDto): Promise<Exam> {
    const exam = new Exam(
      uuidv4(),
      dto.title,
      dto.subject,
      dto.year,
      dto.level,
      dto.fileUrl,
      dto.uploadedById,
    );
    const saved = await this.examRepo.save(exam);

    if (dto.questions?.length) {
      const questions = dto.questions.map(
        (q) =>
          new Question(
            uuidv4(),
            saved.id,
            q.questionText,
            q.points,
            q.correctAnswer,
            q.explanation,
          ),
      );
      await this.questionRepo.saveMany(questions);
    }

    return saved;
  }

  async findById(id: string) {
    const exam = await this.examRepo.findById(id);
    if (!exam) throw new NotFoundException('Exam not found');
    const questions = await this.questionRepo.findByExam(id);
    return { ...exam, questions };
  }
}
