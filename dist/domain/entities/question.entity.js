"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Question = void 0;
class Question {
    id;
    examId;
    questionText;
    points;
    correctAnswer;
    explanation;
    constructor(id, examId, questionText, points, correctAnswer, explanation) {
        this.id = id;
        this.examId = examId;
        this.questionText = questionText;
        this.points = points;
        this.correctAnswer = correctAnswer;
        this.explanation = explanation;
    }
    evaluate(answer) {
        return (answer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase());
    }
}
exports.Question = Question;
//# sourceMappingURL=question.entity.js.map