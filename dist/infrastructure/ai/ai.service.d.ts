export interface AICorrection {
    explanation: string;
    feedback: string;
}
export declare class AiService {
    generateCorrection(questions: {
        text: string;
        correct: string;
        given: string;
        points: number;
    }[], totalScore: number, maxScore: number): Promise<AICorrection>;
}
