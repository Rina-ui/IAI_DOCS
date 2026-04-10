import { api } from "../api";
import type { Training, Correction, AnswerStepResponse, LearningSummary } from "./training.types";

export const trainingService = {
  async start(examId: string): Promise<Training> {
    try {
      const response = await api.post<Training>("/trainings/start", { examId });
      return response.data;
    } catch (error) {
      console.error("[TrainingService] Start training error:", error);
      return {} as Training;
    }
  },

  async submit(
    trainingId: string,
    answers: { questionId: string; answer: string }[]
  ): Promise<Correction> {
    try {
      const response = await api.post<Correction>(
        `/trainings/${trainingId}/submit`,
        { answers }
      );
      return response.data;
    } catch (error) {
      console.error("[TrainingService] Submit answers error:", error);
      return {} as Correction;
    }
  },

  async getCorrection(trainingId: string): Promise<Correction> {
    try {
      const response = await api.get<Correction>(
        `/trainings/${trainingId}/correction`
      );
      return response.data;
    } catch (error) {
      console.error("[TrainingService] Get correction error:", error);
      return {} as Correction;
    }
  },

  async answerStep(
    trainingId: string,
    questionId: string,
    answer: string
  ): Promise<AnswerStepResponse> {
    try {
      const response = await api.post<AnswerStepResponse>(
        `/trainings/${trainingId}/answer-step`,
        { questionId, answer }
      );
      return response.data;
    } catch (error) {
      console.error("[TrainingService] Answer step error:", error);
      return {} as AnswerStepResponse;
    }
  },

  async getLearningSummary(trainingId: string): Promise<LearningSummary> {
    try {
      const response = await api.get<LearningSummary>(
        `/trainings/${trainingId}/learning-summary`
      );
      return response.data;
    } catch (error) {
      console.error("[TrainingService] Get learning summary error:", error);
      return {} as LearningSummary;
    }
  },
};
