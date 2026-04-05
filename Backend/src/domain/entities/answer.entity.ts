export class Answer {
  constructor(
    public readonly id: string,
    public questionId: string,
    public studentAnswer: string,
    public isCorrect: boolean,
    public pointsEarned: number,
  ) {}
}
