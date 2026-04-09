export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role: "admin" | "student" | "teacher";
  level?: string;
  points?: number;
  speciality?: string;
  verified?: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  level: string;
}

export interface AuthResponse {
  token: string;
  user: User;
}

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

export interface ForumPost {
  id: string;
  authorId: string;
  title: string;
  content: string;
  upvotes: number;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

export type SubjectGroup = {
  subject: string;
  exams: Exam[];
  count: number;
};
