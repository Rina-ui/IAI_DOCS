export class Performance {
  constructor(
    public readonly id: string,
    public studentId: string,
    public subject: string,
    public score: number,
    public rank: number = 0,
  ) {}
}
