import * as examRepository from '../../domain/repositories/exam.repository';
import { Exam } from '../../domain/entities/exam.entity';
export declare class ValidateExamUseCase {
    private examRepo;
    constructor(examRepo: examRepository.IExamRepository);
    execute(examId: string, teacherId: string): Promise<Exam>;
}
