import { Repository } from 'typeorm';
import { IExamRepository } from '../../../domain/repositories/exam.repository';
import { Exam } from '../../../domain/entities/exam.entity';
import { ExamOrmEntity } from '../entities/exam.orm-entity';
export declare class ExamTypeOrmRepository implements IExamRepository {
    private readonly repo;
    constructor(repo: Repository<ExamOrmEntity>);
    findById(id: string): Promise<Exam | null>;
    findAll(filters?: {
        level?: string;
        subject?: string;
    }): Promise<Exam[]>;
    findPending(): Promise<Exam[]>;
    save(exam: Exam): Promise<Exam>;
    delete(id: string): Promise<void>;
    private toDomain;
    private toOrm;
}
