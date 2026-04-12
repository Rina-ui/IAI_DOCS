import api from "@/lib/api";
import type {
  TrainingSession,
  TrainingCorrection,
  SubmitTrainingRequest,
  SuccessResponse,
} from "@/lib/types";

export interface LearningSummary {
  sessionId: string;
  strengths: string[];
  weaknesses: string[];
  recommendations: string[];
  overallScore: number;
  aiGeneratedAt: string;
}

export interface StepFeedback {
  questionId: string;
  questionText: string;
  givenAnswer: string;
  correctAnswer: string;
  isCorrect: boolean;
  pointsEarned: number;
  explanation: string;
  tip: string;
  resourceToReview: string;
}

export const startTraining = async (
  data: { examId: string }
): Promise<TrainingSession> => {
  return api.post<TrainingSession>("/trainings/start", data);
};

export const submitTraining = async (
  id: string,
  data: SubmitTrainingRequest
): Promise<TrainingCorrection> => {
  return api.post<TrainingCorrection>(`/trainings/${id}/submit`, data);
};

export const submitAnswerStep = async (
  id: string,
  data: { questionId: string; answer: string }
): Promise<StepFeedback> => {
  return api.post<StepFeedback>(`/trainings/${id}/answer-step`, data);
};

export const getCorrection = async (id: string): Promise<TrainingCorrection> => {
  return api.get<TrainingCorrection>(`/trainings/${id}/correction`);
};

export const getLearningSummary = async (id: string): Promise<LearningSummary> => {
  return api.get<LearningSummary>(`/trainings/${id}/learning-summary`);
};

export default {
  startTraining,
  submitTraining,
  submitAnswerStep,
  getCorrection,
  getLearningSummary,
};
