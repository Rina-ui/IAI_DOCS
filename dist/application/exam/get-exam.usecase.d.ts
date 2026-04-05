import * as examRepository from '../../domain/repositories/exam.repository';
export declare class GetExamsUseCase {
    private examRepo;
    constructor(examRepo: examRepository.IExamRepository);
    execute(filters?: {
        level?: string;
        subject?: string;
    }): Promise<import("../../domain/entities/exam.entity").Exam | null>;
}
