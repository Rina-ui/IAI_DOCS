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
exports.UserTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const user_entity_1 = require("../../../domain/entities/user.entity");
const user_orm_entity_1 = require("../entities/user.orm-entity");
let UserTypeOrmRepository = class UserTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findById(id) {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }
    async findByEmail(email) {
        const orm = await this.repo.findOne({ where: { email } });
        return orm ? this.toDomain(orm) : null;
    }
    async save(user) {
        const orm = this.toOrm(user);
        const saved = await this.repo.save(orm);
        return this.toDomain(saved);
    }
    async delete(id) {
        await this.repo.delete(id);
    }
    toDomain(orm) {
        if (orm.role === user_entity_1.UserRole.STUDENT) {
            return new user_entity_1.Student(orm.id, orm.email, orm.passwordHash, orm.firstName, orm.lastName, orm.level, orm.points);
        }
        if (orm.role === user_entity_1.UserRole.TEACHER) {
            return new user_entity_1.Teacher(orm.id, orm.email, orm.passwordHash, orm.firstName, orm.lastName, orm.speciality, orm.verified);
        }
        return new user_entity_1.User(orm.id, orm.email, orm.passwordHash, orm.firstName, orm.lastName, orm.role);
    }
    toOrm(user) {
        const orm = new user_orm_entity_1.UserOrmEntity();
        orm.id = user.id;
        orm.email = user.email;
        orm.passwordHash = user.passwordHash;
        orm.firstName = user.firstName;
        orm.lastName = user.lastName;
        orm.role = user.role;
        if (user instanceof user_entity_1.Student) {
            orm.level = user.level;
            orm.points = user.points;
        }
        if (user instanceof user_entity_1.Teacher) {
            orm.speciality = user.speciality;
            orm.verified = user.verified;
        }
        return orm;
    }
};
exports.UserTypeOrmRepository = UserTypeOrmRepository;
exports.UserTypeOrmRepository = UserTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(user_orm_entity_1.UserOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], UserTypeOrmRepository);
//# sourceMappingURL=user.typeorm-repository.js.map