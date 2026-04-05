export declare class ForumPost {
    readonly id: string;
    authorId: string;
    title: string;
    content: string;
    upvotes: number;
    createdAt: Date;
    constructor(id: string, authorId: string, title: string, content: string, upvotes?: number, createdAt?: Date);
    upvote(): void;
}
