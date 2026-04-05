import { Repository } from 'typeorm';
import { IQuestionRepository } from '../../../domain/repositories/question.repository';
import { Question } from '../../../domain/entities/question.entity';
import { QuestionOrmEntity } from '../entities/question.orm-entity';
export declare class QuestionTypeOrmRepository implements IQuestionRepository {
    private readonly repo;
    constructor(repo: Repository<QuestionOrmEntity>);
    findByExam(examId: string): Promise<Question[]>;
    findById(id: string): Promise<Question | null>;
    save(question: Question): Promise<Question>;
    saveMany(questions: Question[]): Promise<Question[]>;
    private toDomain;
    private toOrm;
}
