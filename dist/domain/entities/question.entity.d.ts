export declare class Question {
    readonly id: string;
    examId: string;
    questionText: string;
    points: number;
    correctAnswer: string;
    explanation: string;
    constructor(id: string, examId: string, questionText: string, points: number, correctAnswer: string, explanation: string);
    evaluate(answer: string): boolean;
}
