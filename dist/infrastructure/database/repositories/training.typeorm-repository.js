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
exports.TrainingTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const ttraining_entity_1 = require("../../../domain/entities/ttraining.entity");
const training_orm_entity_1 = require("../entities/training.orm-entity");
let TrainingTypeOrmRepository = class TrainingTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }
    async findByStudent(studentId) {
        const list = await this.repo.find({ where: { studentId } });
        return list.map(this.toDomain.bind(this));
    }
    async save(training) {
        const saved = await this.repo.save(this.toOrm(training));
        return this.toDomain(saved);
    }
    toDomain(orm) {
        const t = new ttraining_entity_1.Training(orm.id, orm.studentId, orm.examId, orm.score, orm.startedAt);
        if (orm.submittedAt)
            t.submittedAt = orm.submittedAt;
        return t;
    }
    toOrm(t) {
        const orm = new training_orm_entity_1.TrainingOrmEntity();
        Object.assign(orm, {
            id: t.id,
            studentId: t.studentId,
            examId: t.examId,
            score: t.score,
            startedAt: t.startedAt,
            submittedAt: t.submittedAt,
        });
        return orm;
    }
};
exports.TrainingTypeOrmRepository = TrainingTypeOrmRepository;
exports.TrainingTypeOrmRepository = TrainingTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(training_orm_entity_1.TrainingOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], TrainingTypeOrmRepository);
//# sourceMappingURL=training.typeorm-repository.js.map