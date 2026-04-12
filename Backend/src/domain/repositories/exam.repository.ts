import { Exam } from '../entities/exam.entity';

export interface ExamFilters {
  level?: string;
  subject?: string;
  filiere?: string;
  year?: number;
  subjectId?: string;
}

export interface IExamRepository {
  findById(id: string): Promise<Exam | null>;
  findByTitle(title: string): Promise<Exam | null>;
  findAll(filters?: ExamFilters): Promise<Exam[]>;
  save(exam: Exam): Promise<Exam>;
  findPending(): Promise<Exam[]>;
}

export const EXAM_REPOSITORY = Symbol('IExamRepository');