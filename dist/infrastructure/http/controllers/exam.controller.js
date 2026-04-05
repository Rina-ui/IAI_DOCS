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
exports.ExamController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const jwt_guard_1 = require("../guards/jwt.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const upload_exam_usecase_1 = require("../../../application/exam/upload-exam.usecase");
const validate_exam_usecase_1 = require("../../../application/exam/validate-exam.usecase");
const get_exam_usecase_1 = require("../../../application/exam/get-exam.usecase");
const cloudinary_service_1 = require("../../storage/cloudinary.service");
let ExamController = class ExamController {
    uploadExamUseCase;
    validateExamUseCase;
    getExamsUseCase;
    cloudinaryService;
    constructor(uploadExamUseCase, validateExamUseCase, getExamsUseCase, cloudinaryService) {
        this.uploadExamUseCase = uploadExamUseCase;
        this.validateExamUseCase = validateExamUseCase;
        this.getExamsUseCase = getExamsUseCase;
        this.cloudinaryService = cloudinaryService;
    }
    findAll(level, subject) {
        return this.getExamsUseCase.execute({ level, subject });
    }
    async findOne(id) {
        return this.uploadExamUseCase.findById(id);
    }
    async create(file, body, user) {
        let fileUrl = body.fileUrl || '';
        if (file) {
            fileUrl = await this.cloudinaryService.uploadPdf(file.buffer, `${Date.now()}-${file.originalname}`);
        }
        if (!fileUrl)
            throw new common_1.BadRequestException('Provide a file or a fileUrl');
        const questions = body.questions
            ? typeof body.questions === 'string'
                ? JSON.parse(body.questions)
                : body.questions
            : [];
        return this.uploadExamUseCase.execute({
            title: body.title,
            subject: body.subject,
            year: parseInt(body.year),
            level: body.level,
            fileUrl,
            uploadedById: user.id,
            questions,
        });
    }
    validate(id, user) {
        return this.validateExamUseCase.execute(id, user.id);
    }
};
exports.ExamController = ExamController;
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('level')),
    __param(1, (0, common_1.Query)('subject')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "findAll", null);
__decorate([
    (0, common_1.Get)(':id'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "findOne", null);
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('file', {
        limits: { fileSize: 10 * 1024 * 1024 },
        fileFilter: (req, file, cb) => {
            if (file.mimetype !== 'application/pdf') {
                cb(new common_1.BadRequestException('Only PDF files allowed'), false);
            }
            else {
                cb(null, true);
            }
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], ExamController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/validate'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", void 0)
], ExamController.prototype, "validate", null);
exports.ExamController = ExamController = __decorate([
    (0, common_1.Controller)('exams'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __metadata("design:paramtypes", [upload_exam_usecase_1.UploadExamUseCase,
        validate_exam_usecase_1.ValidateExamUseCase,
        get_exam_usecase_1.GetExamsUseCase,
        cloudinary_service_1.CloudinaryService])
], ExamController);
//# sourceMappingURL=exam.controller.js.map