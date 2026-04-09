import { api } from "../api";
import type { Training, Correction } from "./training.types";

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
};
