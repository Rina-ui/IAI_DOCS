export declare class Training {
    readonly id: string;
    studentId: string;
    examId: string;
    score: number;
    startedAt: Date;
    submittedAt?: Date | undefined;
    constructor(id: string, studentId: string, examId: string, score?: number, startedAt?: Date, submittedAt?: Date | undefined);
    submit(score: number): void;
    isCompleted(): boolean;
}
