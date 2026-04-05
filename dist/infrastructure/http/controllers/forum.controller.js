"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumController = void 0;
const common_1 = require("@nestjs/common");
const jwt_guard_1 = require("../guards/jwt.guard");
const current_user_decorator_1 = require("../decorators/current-user.decorator");
const create_post_usecase_1 = require("../../../application/forum/create-post.usecase");
const upvote_post_usecase_1 = require("../../../application/forum/upvote-post.usecase");
const forumPostRepository = __importStar(require("../../../domain/repositories/forum-post.repository"));
const common_2 = require("@nestjs/common");
let ForumController = class ForumController {
    createPost;
    upvotePost;
    forumRepo;
    constructor(createPost, upvotePost, forumRepo) {
        this.createPost = createPost;
        this.upvotePost = upvotePost;
        this.forumRepo = forumRepo;
    }
    findAll() {
        return this.forumRepo.findAll();
    }
    create(body, user) {
        return this.createPost.execute(user.id, body.title, body.content);
    }
    upvote(id) {
        return this.upvotePost.execute(id);
    }
};
exports.ForumController = ForumController;
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "findAll", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __param(1, (0, current_user_decorator_1.CurrentUser)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "create", null);
__decorate([
    (0, common_1.Patch)(':id/upvote'),
    __param(0, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", void 0)
], ForumController.prototype, "upvote", null);
exports.ForumController = ForumController = __decorate([
    (0, common_1.Controller)('forum'),
    (0, common_1.UseGuards)(jwt_guard_1.JwtAuthGuard),
    __param(2, (0, common_2.Inject)(forumPostRepository.FORUM_POST_REPOSITORY)),
    __metadata("design:paramtypes", [create_post_usecase_1.CreatePostUseCase,
        upvote_post_usecase_1.UpvotePostUseCase, Object])
], ForumController);
//# sourceMappingURL=forum.controller.js.map