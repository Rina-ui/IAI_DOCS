import { api } from "../api";
import type { Exam } from "./exam.types";

export const examService = {
  async getAll(level?: string, subject?: string): Promise<Exam[]> {
    try {
      console.log("[ExamService] Fetching exams, level:", level, "subject:", subject);
      const response = await api.get<Exam[]>("/exams", {
        params: { level, subject },
      });
      console.log("[ExamService] Received", response.data.length, "exams");
      return response.data;
    } catch (error) {
      console.error("[ExamService] Fetch exams error:", error);
      return [];
    }
  },

  async getById(id: string): Promise<Exam & { questions: any[] }> {
    try {
      const response = await api.get<Exam & { questions: any[] }>(
        `/exams/${id}`
      );
      return response.data;
    } catch (error) {
      console.error("[ExamService] Get exam by ID error:", error);
      return {} as Exam & { questions: any[] };
    }
  },
};
