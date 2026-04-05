"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ExamModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const upload_exam_usecase_1 = require("../application/exam/upload-exam.usecase");
const validate_exam_usecase_1 = require("../application/exam/validate-exam.usecase");
const get_exam_usecase_1 = require("../application/exam/get-exam.usecase");
const exam_orm_entity_1 = require("../infrastructure/database/entities/exam.orm-entity");
const question_orm_entity_1 = require("../infrastructure/database/entities/question.orm-entity");
const exam_typeorm_repository_1 = require("../infrastructure/database/repositories/exam.typeorm-repository");
const question_typeorm_repository_1 = require("../infrastructure/database/repositories/question.typeorm-repository");
const exam_controller_1 = require("../infrastructure/http/controllers/exam.controller");
const exam_repository_1 = require("../domain/repositories/exam.repository");
const question_repository_1 = require("../domain/repositories/question.repository");
const cloudinary_service_1 = require("../infrastructure/storage/cloudinary.service");
const auth_module_1 = require("./auth.module");
let ExamModule = class ExamModule {
};
exports.ExamModule = ExamModule;
exports.ExamModule = ExamModule = __decorate([
    (0, common_1.Module)({
        imports: [
            typeorm_1.TypeOrmModule.forFeature([exam_orm_entity_1.ExamOrmEntity, question_orm_entity_1.QuestionOrmEntity]),
            auth_module_1.AuthModule,
        ],
        controllers: [exam_controller_1.ExamController],
        providers: [
            upload_exam_usecase_1.UploadExamUseCase,
            validate_exam_usecase_1.ValidateExamUseCase,
            get_exam_usecase_1.GetExamsUseCase,
            cloudinary_service_1.CloudinaryService,
            { provide: exam_repository_1.EXAM_REPOSITORY, useClass: exam_typeorm_repository_1.ExamTypeOrmRepository },
            { provide: question_repository_1.QUESTION_REPOSITORY, useClass: question_typeorm_repository_1.QuestionTypeOrmRepository },
        ],
        exports: [exam_repository_1.EXAM_REPOSITORY, question_repository_1.QUESTION_REPOSITORY],
    })
], ExamModule);
//# sourceMappingURL=exam.module.js.map