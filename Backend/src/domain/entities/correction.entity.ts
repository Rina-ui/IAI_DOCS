export class Correction {
  constructor(
    public readonly id: string,
    public trainingId: string,
    public totalScore: number,
    public percentage: number,
    public aiExplanation: string,
    public generatedAt: Date = new Date(),
  ) {}

  isPassed(passingScore = 50): boolean {
    return this.percentage >= passingScore;
  }
}
