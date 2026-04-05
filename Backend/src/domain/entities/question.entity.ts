export class Question {
  constructor(
    public readonly id: string,
    public examId: string,
    public questionText: string,
    public points: number,
    public correctAnswer: string,
    public explanation: string,
  ) {}

  evaluate(answer: string): boolean {
    return (
      answer.trim().toLowerCase() === this.correctAnswer.trim().toLowerCase()
    );
  }
}
