export declare class Correction {
    readonly id: string;
    trainingId: string;
    totalScore: number;
    percentage: number;
    aiExplanation: string;
    generatedAt: Date;
    constructor(id: string, trainingId: string, totalScore: number, percentage: number, aiExplanation: string, generatedAt?: Date);
    isPassed(passingScore?: number): boolean;
}
