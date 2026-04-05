export declare class Answer {
    readonly id: string;
    questionId: string;
    studentAnswer: string;
    isCorrect: boolean;
    pointsEarned: number;
    constructor(id: string, questionId: string, studentAnswer: string, isCorrect: boolean, pointsEarned: number);
}
