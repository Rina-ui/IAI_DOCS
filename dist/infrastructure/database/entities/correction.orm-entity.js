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
Object.defineProperty(exports, "__esModule", { value: true });
exports.CorrectionOrmEntity = void 0;
const typeorm_1 = require("typeorm");
let CorrectionOrmEntity = class CorrectionOrmEntity {
    id;
    trainingId;
    totalScore;
    percentage;
    aiExplanation;
    generatedAt;
};
exports.CorrectionOrmEntity = CorrectionOrmEntity;
__decorate([
    (0, typeorm_1.PrimaryColumn)('uuid'),
    __metadata("design:type", String)
], CorrectionOrmEntity.prototype, "id", void 0);
__decorate([
    (0, typeorm_1.Column)(),
    __metadata("design:type", String)
], CorrectionOrmEntity.prototype, "trainingId", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], CorrectionOrmEntity.prototype, "totalScore", void 0);
__decorate([
    (0, typeorm_1.Column)('float'),
    __metadata("design:type", Number)
], CorrectionOrmEntity.prototype, "percentage", void 0);
__decorate([
    (0, typeorm_1.Column)('text'),
    __metadata("design:type", String)
], CorrectionOrmEntity.prototype, "aiExplanation", void 0);
__decorate([
    (0, typeorm_1.CreateDateColumn)(),
    __metadata("design:type", Date)
], CorrectionOrmEntity.prototype, "generatedAt", void 0);
exports.CorrectionOrmEntity = CorrectionOrmEntity = __decorate([
    (0, typeorm_1.Entity)('corrections')
], CorrectionOrmEntity);
//# sourceMappingURL=correction.orm-entity.js.map