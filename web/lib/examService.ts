import api from "@/lib/api";
import type { Exam, CreateExamRequest, ExamsFilterParams } from "@/lib/types";

export const getExams = async (params?: ExamsFilterParams): Promise<Exam[]> => {
  const queryParams = new URLSearchParams();
  if (params?.level) queryParams.append("level", params.level);
  if (params?.subject) queryParams.append("subject", params.subject);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  return api.get<Exam[]>(`/exams${queryString}`);
};

export const getExam = async (id: string): Promise<Exam> => {
  return api.get<Exam>(`/exams/${id}`);
};

export const createExam = async (data: CreateExamRequest): Promise<Exam> => {
  const formData = new FormData();
  
  // Add text fields
  formData.append("title", data.title);
  formData.append("subject", data.subject);
  formData.append("year", data.year.toString());
  formData.append("level", data.level);
  
  // Add file if provided
  if (data.file) {
    formData.append("file", data.file);
  } else if (data.fileUrl) {
    formData.append("fileUrl", data.fileUrl);
  }
  
  // Add questions if provided (as JSON string)
  if (data.questions && data.questions.length > 0) {
    formData.append("questions", JSON.stringify(data.questions));
  }
  
  // Don't set Content-Type header - let browser set it with boundary
  return api.post<Exam>("/exams", formData, {
    headers: {},
  });
};

export const validateExam = async (id: string): Promise<Exam> => {
  return api.patch<Exam>(`/exams/${id}/validate`);
};

export default {
  getExams,
  getExam,
  createExam,
  validateExam,
};
