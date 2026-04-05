"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TrainingModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const start_training_usecase_1 = require("../application/training/start-training.usecase");
const submit_training_usecase_1 = require("../application/training/submit-training.usecase");
const get_correction_usecase_1 = require("../application/training/get-correction.usecase");
const training_orm_entity_1 = require("../infrastructure/database/entities/training.orm-entity");
const correction_orm_entity_1 = require("../infrastructure/database/entities/correction.orm-entity");
const training_typeorm_repository_1 = require("../infrastructure/database/repositories/training.typeorm-repository");
const correction_typeorm_repository_1 = require("../infrastructure/database/repositories/correction.typeorm-repository");
const training_controller_1 = require("../infrastructure/http/controllers/training.controller");
const ai_service_1 = require("../infrastructure/ai/ai.service");
const training_repository_1 = require("../domain/repositories/training.repository");
const correction_repository_1 = require("../domain/repositories/correction.repository");
const exam_module_1 = require("./exam.module");
const auth_module_1 = require("./auth.module");
let TrainingModule = class TrainingModule {
};
exports.TrainingModule = TrainingModule;
exports.TrainingModule = TrainingModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([training_orm_entity_1.TrainingOrmEntity, correction_orm_entity_1.CorrectionOrmEntity]),
            exam_module_1.ExamModule,
            auth_module_1.AuthModule,
        ],
        controllers: [training_controller_1.TrainingController],
        providers: [
            start_training_usecase_1.StartTrainingUseCase,
            submit_training_usecase_1.SubmitTrainingUseCase,
            get_correction_usecase_1.GetCorrectionUseCase,
            ai_service_1.AiService,
            { provide: training_repository_1.TRAINING_REPOSITORY, useClass: training_typeorm_repository_1.TrainingTypeOrmRepository },
            { provide: correction_repository_1.CORRECTION_REPOSITORY, useClass: correction_typeorm_repository_1.CorrectionTypeOrmRepository },
        ],
    })
], TrainingModule);
//# sourceMappingURL=training.module.js.map