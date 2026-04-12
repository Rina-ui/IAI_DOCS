import tokenService from "@\/lib\/tokenService";

export interface Exam {
  id: string;
  title: string;
  subject: string;
  year: number;
  level: string;
  fileUrl: string;
  uploadedById: string;
  status: string;
  questions: any[];
}

export const getExams = async (params?: { level?: string; subject?: string }): Promise<Exam[]> => {
  const token = tokenService.getToken();
  
  const queryParams = new URLSearchParams();
  if (params?.level) queryParams.append("level", params.level);
  if (params?.subject) queryParams.append("subject", params.subject);
  
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  
  const response = await fetch(`http://localhost:8080/exams${queryString}`, {
    method: "GET",
    headers: {
      "accept": "*/*",
      "Authorization": `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Erreur lors de la récupération des examens (HTTP ${response.status})`);
  }

  return response.json();
};

export default {
  getExams,
};
