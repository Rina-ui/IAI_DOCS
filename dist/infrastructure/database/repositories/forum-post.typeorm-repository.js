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
exports.ForumPostTypeOrmRepository = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const forum_post_entity_1 = require("../../../domain/entities/forum-post.entity");
const forum_post_orm_entity_1 = require("../entities/forum-post.orm-entity");
let ForumPostTypeOrmRepository = class ForumPostTypeOrmRepository {
    repo;
    constructor(repo) {
        this.repo = repo;
    }
    async findAll() {
        const list = await this.repo.find({ order: { createdAt: 'DESC' } });
        return list.map(this.toDomain);
    }
    async findById(id) {
        const orm = await this.repo.findOne({ where: { id } });
        return orm ? this.toDomain(orm) : null;
    }
    async save(post) {
        const saved = await this.repo.save(this.toOrm(post));
        return this.toDomain(saved);
    }
    toDomain(orm) {
        return new forum_post_entity_1.ForumPost(orm.id, orm.authorId, orm.title, orm.content, orm.upvotes, orm.createdAt);
    }
    toOrm(p) {
        const orm = new forum_post_orm_entity_1.ForumPostOrmEntity();
        Object.assign(orm, {
            id: p.id,
            authorId: p.authorId,
            title: p.title,
            content: p.content,
            upvotes: p.upvotes,
        });
        return orm;
    }
};
exports.ForumPostTypeOrmRepository = ForumPostTypeOrmRepository;
exports.ForumPostTypeOrmRepository = ForumPostTypeOrmRepository = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(forum_post_orm_entity_1.ForumPostOrmEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], ForumPostTypeOrmRepository);
//# sourceMappingURL=forum-post.typeorm-repository.js.map