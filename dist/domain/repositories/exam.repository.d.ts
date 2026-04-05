import { Exam } from '../entities/exam.entity';
export interface IExamRepository {
    findById(id: string): Promise<Exam | null>;
    findByTitle(title: string): Promise<Exam | null>;
    findAll(filters?: {
        level?: string;
        subject?: string;
    }): Promise<Exam | null>;
    save(exam: Exam): Promise<Exam>;
    findPending(): Promise<Exam[]>;
}
export declare const EXAM_REPOSITORY: unique symbol;
