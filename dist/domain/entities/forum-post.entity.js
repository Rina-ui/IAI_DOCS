"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ForumPost = void 0;
class ForumPost {
    id;
    authorId;
    title;
    content;
    upvotes;
    createdAt;
    constructor(id, authorId, title, content, upvotes = 0, createdAt = new Date()) {
        this.id = id;
        this.authorId = authorId;
        this.title = title;
        this.content = content;
        this.upvotes = upvotes;
        this.createdAt = createdAt;
    }
    upvote() {
        this.upvotes += 1;
    }
}
exports.ForumPost = ForumPost;
//# sourceMappingURL=forum-post.entity.js.map