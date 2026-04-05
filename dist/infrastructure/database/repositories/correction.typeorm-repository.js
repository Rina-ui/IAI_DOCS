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
exports.CorrectionTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const correction_entity_1 = require("../../../domain/entities/correction.entity");
const correction_orm_entity_1 = require("../entities/correction.orm-entity");
let CorrectionTypeOrmRepository = class CorrectionTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findByTraining(trainingId) {
        const orm = await this.repo.findOne({ where: { trainingId } });
        return orm ? this.toDomain(orm) : null;
    }
    async save(correction) {
        const saved = await this.repo.save(this.toOrm(correction));
        return this.toDomain(saved);
    }
    toDomain(orm) {
        return new correction_entity_1.Correction(orm.id, orm.trainingId, orm.totalScore, orm.percentage, orm.aiExplanation, orm.generatedAt);
    }
    toOrm(c) {
        const orm = new correction_orm_entity_1.CorrectionOrmEntity();
        Object.assign(orm, {
            id: c.id,
            trainingId: c.trainingId,
            totalScore: c.totalScore,
            percentage: c.percentage,
            aiExplanation: c.aiExplanation,
        });
        return orm;
    }
};
exports.CorrectionTypeOrmRepository = CorrectionTypeOrmRepository;
exports.CorrectionTypeOrmRepository = CorrectionTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(correction_orm_entity_1.CorrectionOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], CorrectionTypeOrmRepository);
//# sourceMappingURL=correction.typeorm-repository.js.map