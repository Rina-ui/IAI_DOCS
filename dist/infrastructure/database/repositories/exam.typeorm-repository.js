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
exports.ExamTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const exam_entity_1 = require("../../../domain/entities/exam.entity");
const exam_orm_entity_1 = require("../entities/exam.orm-entity");
let ExamTypeOrmRepository = class ExamTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }
    async findAll(filters) {
        const where = { status: 'validated' };
        if (filters?.level)
            where.level = filters.level;
        if (filters?.subject)
            where.subject = filters.subject;
        const list = await this.repo.find({ where });
        return list.map(this.toDomain);
    }
    async findPending() {
        const list = await this.repo.find({ where: { status: 'pending' } });
        return list.map(this.toDomain);
    }
    async save(exam) {
        const saved = await this.repo.save(this.toOrm(exam));
        return this.toDomain(saved);
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    toDomain(orm) {
        return new exam_entity_1.Exam(orm.id, orm.title, orm.subject, orm.year, orm.level, orm.fileUrl, orm.uploadedById, orm.status);
    }
    toOrm(exam) {
        const orm = new exam_orm_entity_1.ExamOrmEntity();
        Object.assign(orm, {
            id: exam.id,
            title: exam.title,
            subject: exam.subject,
            year: exam.year,
            level: exam.level,
            fileUrl: exam.fileUrl,
            uploadedById: exam.uploadedById,
            status: exam.status,
        });
        return orm;
    }
};
exports.ExamTypeOrmRepository = ExamTypeOrmRepository;
exports.ExamTypeOrmRepository = ExamTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(exam_orm_entity_1.ExamOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ExamTypeOrmRepository);
//# sourceMappingURL=exam.typeorm-repository.js.map