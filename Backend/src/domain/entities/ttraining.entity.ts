export class Training {
  constructor(
    public readonly id: string,
    public studentId: string,
    public examId: string,
    public score: number = 0,
    public startedAt: Date = new Date(),
    public submittedAt?: Date,
  ) {}

  submit(score: number): void {
    if (this.submittedAt) throw new Error('Training already submitted');
    this.score = score;
    this.submittedAt = new Date();
  }

  isCompleted(): boolean {
    return !!this.submittedAt;
  }
}
