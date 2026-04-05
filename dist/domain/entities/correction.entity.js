"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Correction = void 0;
class Correction {
    id;
    trainingId;
    totalScore;
    percentage;
    aiExplanation;
    generatedAt;
    constructor(id, trainingId, totalScore, percentage, aiExplanation, generatedAt = new Date()) {
        this.id = id;
        this.trainingId = trainingId;
        this.totalScore = totalScore;
        this.percentage = percentage;
        this.aiExplanation = aiExplanation;
        this.generatedAt = generatedAt;
    }
    isPassed(passingScore = 50) {
        return this.percentage >= passingScore;
    }
}
exports.Correction = Correction;
//# sourceMappingURL=correction.entity.js.map