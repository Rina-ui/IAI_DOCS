export class ForumPost {
  constructor(
    public readonly id: string,
    public authorId: string,
    public title: string,
    public content: string,
    public upvotes: number = 0,
    public createdAt: Date = new Date(),
  ) {}

  upvote(): void {
    this.upvotes += 1;
  }
}
