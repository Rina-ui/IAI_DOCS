"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Training = void 0;
class Training {
    id;
    studentId;
    examId;
    score;
    startedAt;
    submittedAt;
    constructor(id, studentId, examId, score = 0, startedAt = new Date(), submittedAt) {
        this.id = id;
        this.studentId = studentId;
        this.examId = examId;
        this.score = score;
        this.startedAt = startedAt;
        this.submittedAt = submittedAt;
    }
    submit(score) {
        if (this.submittedAt)
            throw new Error('Training already submitted');
        this.score = score;
        this.submittedAt = new Date();
    }
    isCompleted() {
        return !!this.submittedAt;
    }
}
exports.Training = Training;
//# sourceMappingURL=ttraining.entity.js.map