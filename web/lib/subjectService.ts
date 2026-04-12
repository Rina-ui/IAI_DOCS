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

// Backend response types
interface SubjectByFiliereResponse {
  filiere: string;
  subjects: Subject[];
}

interface SubjectsGroupedResponse {
  TC1: Subject[];
  TC2: Subject[];
  GLSI: Subject[];
  ASR: Subject[];
}

/**
 * Get all subjects or filter by filiere
 * Handles both response formats from backend
 */
export const getSubjects = async (filiere?: string): Promise<Subject[]> => {
  const queryParams = filiere ? `?filiere=${filiere}` : "";
  const response = await api.get<SubjectByFiliereResponse | SubjectsGroupedResponse>(`/subjects${queryParams}`);
  
  // If filiere is provided, backend returns { filiere: string, subjects: Subject[] }
  if (filiere && 'subjects' in response) {
    return response.subjects;
  }
  
  // If no filiere, backend returns { TC1: [], TC2: [], GLSI: [], ASR: [] }
  // Flatten all subjects into a single array
  if ('TC1' in response) {
    return [
      ...(response.TC1 || []),
      ...(response.TC2 || []),
      ...(response.GLSI || []),
      ...(response.ASR || []),
    ];
  }
  
  return [];
};

/**
 * Get subjects for a specific filiere
 */
export const getSubjectsByFiliere = async (filiere: string): Promise<Subject[]> => {
  return api.get<Subject[]>(`/subjects/${filiere}/exams`);
};

export default {
  getSubjects,
  getSubjectsByFiliere,
};
