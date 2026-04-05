import { Question } from '../entities/question.entity';
export interface IQuestionRepository {
    findByExam(examId: string): Promise<Question[]>;
    findById(id: string): Promise<Question | null>;
    save(question: Question): Promise<Question>;
    saveMany(questions: Question[]): Promise<Question[]>;
}
export declare const QUESTION_REPOSITORY: unique symbol;
