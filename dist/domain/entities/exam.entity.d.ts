export declare enum ExamStatus {
    PENDING = "pending",
    VALIDATED = "validated",
    REJECTED = "rejected"
}
declare class Question {
}
export declare class Exam {
    readonly id: string;
    title: string;
    subject: string;
    year: number;
    level: string;
    fileUrl: string;
    uploadedById: string;
    status: ExamStatus;
    questions: Question[];
    constructor(id: string, title: string, subject: string, year: number, level: string, fileUrl: string, uploadedById: string, status?: ExamStatus, questions?: Question[]);
    validate(): void;
    isAvailableForTraining(): boolean;
}
export {};
