// ==========================================
// AUTH TYPES
// ==========================================

export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  role?: string;
  level?: string;
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

// ==========================================
// EXAM TYPES
// ==========================================

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string;
  fileUrl: string;
  uploadedById: string;
  status: "pending" | "validated" | "rejected";
  questions: ExamQuestion[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ExamQuestion {
  id: string;
  content: string;
  type: "multiple_choice" | "open_ended" | "true_false";
  options?: string[];
  correctAnswer?: string | string[];
  points?: number;
}

export interface CreateExamRequest {
  title: string;
  subject: string;
  year: number;
  level: string;
  file?: File;
  fileUrl?: string;
  questions?: ExamQuestion[];
}

export interface ExamsFilterParams {
  level?: string;
  subject?: string;
}

// ==========================================
// TRAINING TYPES
// ==========================================

export interface TrainingSession {
  id: string;
  examId: string;
  studentId: string;
  status: "in_progress" | "completed" | "submitted";
  startedAt: string;
  completedAt?: string;
  answers?: TrainingAnswer[];
}

export interface StartTrainingRequest {
  examId: string;
}

export interface TrainingAnswer {
  questionId: string;
  answer: string | string[];
}

export interface SubmitTrainingRequest {
  answers: TrainingAnswer[];
}

export interface TrainingCorrection {
  id: string;
  sessionId: string;
  score: number;
  totalPoints: number;
  feedback: string;
  questionCorrections: QuestionCorrection[];
  aiGeneratedAt: string;
}

export interface QuestionCorrection {
  questionId: string;
  studentAnswer: string | string[];
  correctAnswer: string | string[];
  isCorrect: boolean;
  points: number;
  maxPoints: number;
  feedback?: string;
}

// ==========================================
// FORUM TYPES
// ==========================================

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  votes: number;
  answersCount: number;
  views: number;
  tags?: string[];
  createdAt: string;
  updatedAt?: string;
  upvotedByUser?: boolean;
}

export interface CreateForumPostRequest {
  title: string;
  content: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  hasMore: boolean;
}

export interface SuccessResponse {
  success: boolean;
  message?: string;
}
