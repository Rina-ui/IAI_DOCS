import * as examRepository from '../../domain/repositories/exam.repository';
import * as questionRepository from '../../domain/repositories/question.repository';
import { Exam } from '../../domain/entities/exam.entity';
import { Question } from '../../domain/entities/question.entity';
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
export declare class UploadExamUseCase {
    private examRepo;
    private questionRepo;
    constructor(examRepo: examRepository.IExamRepository, questionRepo: questionRepository.IQuestionRepository);
    execute(dto: UploadExamDto): Promise<Exam>;
    findById(id: string): Promise<{
        questions: Question[];
        id: string;
        title: string;
        subject: string;
        year: number;
        level: string;
        fileUrl: string;
        uploadedById: string;
        status: import("../../domain/entities/exam.entity").ExamStatus;
    }>;
}
