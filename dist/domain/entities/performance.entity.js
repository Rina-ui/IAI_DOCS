"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Performance = void 0;
class Performance {
    id;
    studentId;
    subject;
    score;
    rank;
    constructor(id, studentId, subject, score, rank = 0) {
        this.id = id;
        this.studentId = studentId;
        this.subject = subject;
        this.score = score;
        this.rank = rank;
    }
}
exports.Performance = Performance;
//# sourceMappingURL=performance.entity.js.map