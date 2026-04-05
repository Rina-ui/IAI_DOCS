"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SubmitTrainingUseCase = void 0;
const common_1 = require("@nestjs/common");
const trainingRepository = __importStar(require("../../domain/repositories/training.repository"));
const questionRepository = __importStar(require("../../domain/repositories/question.repository"));
const correctionRepository = __importStar(require("../../domain/repositories/correction.repository"));
const correction_entity_1 = require("../../domain/entities/correction.entity");
const ai_service_1 = require("../../infrastructure/ai/ai.service");
const uuid_1 = require("uuid");
let SubmitTrainingUseCase = class SubmitTrainingUseCase {
    trainingRepo;
    questionRepo;
    correctionRepo;
    aiService;
    constructor(trainingRepo, questionRepo, correctionRepo, aiService) {
        this.trainingRepo = trainingRepo;
        this.questionRepo = questionRepo;
        this.correctionRepo = correctionRepo;
        this.aiService = aiService;
    }
    async execute(trainingId, answers) {
        const training = await this.trainingRepo.findById(trainingId);
        if (!training)
            throw new common_1.NotFoundException('Training not found');
        if (training.isCompleted())
            throw new common_1.BadRequestException('Training already submitted');
        const questions = await this.questionRepo.findByExam(training.examId);
        if (!questions.length)
            throw new common_1.BadRequestException('No questions found for this exam');
        let totalScore = 0;
        const maxScore = questions.reduce((sum, q) => sum + q.points, 0);
        const aiInput = [];
        for (const answer of answers) {
            const question = questions.find((q) => q.id === answer.questionId);
            if (!question)
                continue;
            const isCorrect = question.evaluate(answer.answer);
            if (isCorrect)
                totalScore += question.points;
            aiInput.push({
                text: question.questionText,
                correct: question.correctAnswer,
                given: answer.answer,
                points: question.points,
            });
        }
        const percentage = maxScore > 0 ? Math.round((totalScore / maxScore) * 100) : 0;
        const aiResult = await this.aiService.generateCorrection(aiInput, totalScore, maxScore);
        training.submit(totalScore);
        await this.trainingRepo.save(training);
        const correction = new correction_entity_1.Correction((0, uuid_1.v4)(), trainingId, totalScore, percentage, aiResult.explanation);
        return this.correctionRepo.save(correction);
    }
};
exports.SubmitTrainingUseCase = SubmitTrainingUseCase;
exports.SubmitTrainingUseCase = SubmitTrainingUseCase = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, common_1.Inject)(trainingRepository.TRAINING_REPOSITORY)),
    __param(1, (0, common_1.Inject)(questionRepository.QUESTION_REPOSITORY)),
    __param(2, (0, common_1.Inject)(correctionRepository.CORRECTION_REPOSITORY)),
    __metadata("design:paramtypes", [Object, Object, Object, ai_service_1.AiService])
], SubmitTrainingUseCase);
//# sourceMappingURL=submit-training.usecase.js.map