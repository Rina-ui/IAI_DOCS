export class ForumReply {
    constructor(
        public readonly id: string,
        public postId: string,
        public authorId: string,
        public content: string,
        public upvotes: number = 0,
        public createdAt: Date = new Date(),
    ) {}

    upvote(): void {
        this.upvotes += 1;
    }
}