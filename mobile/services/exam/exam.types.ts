export interface Question {
  id: string;
  examId: string;
  questionText: string;
  points: number;
  correctAnswer: string;
  explanation: string;
}

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string;
  fileUrl: string;
  uploadedById: string;
  status: "pending" | "validated" | "rejected";
  createdAt: string;
  questions?: Question[];
}

export type SubjectGroup = {
  subject: string;
  exams: Exam[];
  count: number;
};
