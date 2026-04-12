export enum ExamStatus {
  PENDING = 'pending',
  VALIDATED = 'validated',
  REJECTED = 'rejected',
}

class Question {}

export type Filiere = 'TC1' | 'TC2' | 'GLSI' | 'ASR' | 'COMMUN';

export class Exam {
  constructor(
      public readonly id: string,
      public title: string,
      public subject: string,
      public year: number,
      public level: string,
      public filiere: string,
      public fileUrl: string,
      public uploadedById: string,
      public status: ExamStatus = ExamStatus.PENDING,
      public questions?: string,
      public subjectId?: string,
  ) {}

  validate(): void {
    if (this.status !== ExamStatus.PENDING) {
      throw new Error('Only pending exams can be validated');
    }
    this.status = ExamStatus.VALIDATED;
  }

  isAvailableForTraining(): boolean {
    return this.status === ExamStatus.VALIDATED;
  }
}
