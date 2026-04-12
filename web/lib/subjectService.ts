import api from "@/lib/api";
import type { SuccessResponse } from "@/lib/types";

export interface Subject {
  id: string;
  name: string;
  code: string;
  filiere: string;
  description?: string;
  examCount?: number;
}

export const getSubjects = async (filiere?: string): Promise<Subject[]> => {
  const queryParams = filiere ? `?filiere=${filiere}` : "";
  return api.get<Subject[]>(`/subjects${queryParams}`);
};

export const getSubjectsByFiliere = async (filiere: string): Promise<Subject[]> => {
  return api.get<Subject[]>(`/subjects/${filiere}/exams`);
};

export default {
  getSubjects,
  getSubjectsByFiliere,
};
