"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../guards/jwt.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const start_training_usecase_1 = require("../../../application/training/start-training.usecase");
const submit_training_usecase_1 = require("../../../application/training/submit-training.usecase");
const get_correction_usecase_1 = require("../../../application/training/get-correction.usecase");
let TrainingController = class TrainingController {
    startTraining;
    submitTraining;
    getCorrection;
    constructor(startTraining, submitTraining, getCorrection) {
        this.startTraining = startTraining;
        this.submitTraining = submitTraining;
        this.getCorrection = getCorrection;
    }
    start(examId, user) {
        return this.startTraining.execute(user.id, examId);
    }
    submit(id, answers) {
        return this.submitTraining.execute(id, answers);
    }
    correction(id) {
        return this.getCorrection.execute(id);
    }
};
exports.TrainingController = TrainingController;
__decorate([
    (0, common_1.Post)('start'),
    __param(0, (0, common_1.Body)('examId')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "start", null);
__decorate([
    (0, common_1.Post)(':id/submit'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('answers')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Array]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "submit", null);
__decorate([
    (0, common_1.Get)(':id/correction'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], TrainingController.prototype, "correction", null);
exports.TrainingController = TrainingController = __decorate([
    (0, common_1.Controller)('trainings'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [start_training_usecase_1.StartTrainingUseCase,
        submit_training_usecase_1.SubmitTrainingUseCase,
        get_correction_usecase_1.GetCorrectionUseCase])
], TrainingController);
//# sourceMappingURL=training.controller.js.map