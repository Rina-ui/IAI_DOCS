"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exam = exports.ExamStatus = void 0;
var ExamStatus;
(function (ExamStatus) {
    ExamStatus["PENDING"] = "pending";
    ExamStatus["VALIDATED"] = "validated";
    ExamStatus["REJECTED"] = "rejected";
})(ExamStatus || (exports.ExamStatus = ExamStatus = {}));
class Question {
}
class Exam {
    id;
    title;
    subject;
    year;
    level;
    fileUrl;
    uploadedById;
    status;
    questions;
    constructor(id, title, subject, year, level, fileUrl, uploadedById, status = ExamStatus.PENDING, questions = []) {
        this.id = id;
        this.title = title;
        this.subject = subject;
        this.year = year;
        this.level = level;
        this.fileUrl = fileUrl;
        this.uploadedById = uploadedById;
        this.status = status;
        this.questions = questions;
    }
    validate() {
        if (this.status !== ExamStatus.PENDING) {
            throw new Error('Only pending exams can be validated');
        }
        this.status = ExamStatus.VALIDATED;
    }
    isAvailableForTraining() {
        return this.status === ExamStatus.VALIDATED;
    }
}
exports.Exam = Exam;
//# sourceMappingURL=exam.entity.js.map