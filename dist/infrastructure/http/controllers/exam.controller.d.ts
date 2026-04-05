import { UploadExamUseCase } from '../../../application/exam/upload-exam.usecase';
import { ValidateExamUseCase } from '../../../application/exam/validate-exam.usecase';
import { GetExamsUseCase } from '../../../application/exam/get-exam.usecase';
import { CloudinaryService } from '../../storage/cloudinary.service';
export declare class ExamController {
    private uploadExamUseCase;
    private validateExamUseCase;
    private getExamsUseCase;
    private cloudinaryService;
    constructor(uploadExamUseCase: UploadExamUseCase, validateExamUseCase: ValidateExamUseCase, getExamsUseCase: GetExamsUseCase, cloudinaryService: CloudinaryService);
    findAll(level?: string, subject?: string): Promise<import("../../../domain/entities/exam.entity").Exam | null>;
    findOne(id: string): Promise<{
        questions: import("../../../domain/entities/question.entity").Question[];
        id: string;
        title: string;
        subject: string;
        year: number;
        level: string;
        fileUrl: string;
        uploadedById: string;
        status: import("../../../domain/entities/exam.entity").ExamStatus;
    }>;
    create(file: Express.Multer.File, body: any, user: any): Promise<import("../../../domain/entities/exam.entity").Exam>;
    validate(id: string, user: any): Promise<import("../../../domain/entities/exam.entity").Exam>;
}
