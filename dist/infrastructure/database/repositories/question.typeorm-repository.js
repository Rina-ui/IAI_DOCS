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
exports.QuestionTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const question_entity_1 = require("../../../domain/entities/question.entity");
const question_orm_entity_1 = require("../entities/question.orm-entity");
let QuestionTypeOrmRepository = class QuestionTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findByExam(examId) {
        const list = await this.repo.find({ where: { examId } });
        return list.map(this.toDomain);
    }
    async findById(id) {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }
    async save(question) {
        const saved = await this.repo.save(this.toOrm(question));
        return this.toDomain(saved);
    }
    async saveMany(questions) {
        const saved = await this.repo.save(questions.map(this.toOrm));
        return saved.map(this.toDomain);
    }
    toDomain(orm) {
        return new question_entity_1.Question(orm.id, orm.examId, orm.questionText, orm.points, orm.correctAnswer, orm.explanation);
    }
    toOrm(q) {
        const orm = new question_orm_entity_1.QuestionOrmEntity();
        Object.assign(orm, {
            id: q.id,
            examId: q.examId,
            questionText: q.questionText,
            points: q.points,
            correctAnswer: q.correctAnswer,
            explanation: q.explanation,
        });
        return orm;
    }
};
exports.QuestionTypeOrmRepository = QuestionTypeOrmRepository;
exports.QuestionTypeOrmRepository = QuestionTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(question_orm_entity_1.QuestionOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], QuestionTypeOrmRepository);
//# sourceMappingURL=question.typeorm-repository.js.map