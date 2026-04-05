"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumModule = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const create_post_usecase_1 = require("../application/forum/create-post.usecase");
const upvote_post_usecase_1 = require("../application/forum/upvote-post.usecase");
const forum_post_orm_entity_1 = require("../infrastructure/database/entities/forum-post.orm-entity");
const forum_post_typeorm_repository_1 = require("../infrastructure/database/repositories/forum-post.typeorm-repository");
const forum_controller_1 = require("../infrastructure/http/controllers/forum.controller");
const forum_post_repository_1 = require("../domain/repositories/forum-post.repository");
const auth_module_1 = require("./auth.module");
let ForumModule = class ForumModule {
};
exports.ForumModule = ForumModule;
exports.ForumModule = ForumModule = __decorate([
    (0, common_1.Module)({
        imports: [typeorm_1.TypeOrmModule.forFeature([forum_post_orm_entity_1.ForumPostOrmEntity]), auth_module_1.AuthModule],
        controllers: [forum_controller_1.ForumController],
        providers: [
            create_post_usecase_1.CreatePostUseCase,
            upvote_post_usecase_1.UpvotePostUseCase,
            { provide: forum_post_repository_1.FORUM_POST_REPOSITORY, useClass: forum_post_typeorm_repository_1.ForumPostTypeOrmRepository },
        ],
    })
], ForumModule);
//# sourceMappingURL=forum.module.js.map