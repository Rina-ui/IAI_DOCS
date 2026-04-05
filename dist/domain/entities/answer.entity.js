"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Answer = void 0;
class Answer {
    id;
    questionId;
    studentAnswer;
    isCorrect;
    pointsEarned;
    constructor(id, questionId, studentAnswer, isCorrect, pointsEarned) {
        this.id = id;
        this.questionId = questionId;
        this.studentAnswer = studentAnswer;
        this.isCorrect = isCorrect;
        this.pointsEarned = pointsEarned;
    }
}
exports.Answer = Answer;
//# sourceMappingURL=answer.entity.js.map