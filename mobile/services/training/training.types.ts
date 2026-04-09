export interface Training {
  id: string;
  studentId: string;
  examId: string;
  score: number;
  startedAt: string;
  submittedAt: string | null;
}

export interface Correction {
  id: string;
  trainingId: string;
  totalScore: number;
  percentage: number;
  aiExplanation: string;
  generatedAt: string;
}
