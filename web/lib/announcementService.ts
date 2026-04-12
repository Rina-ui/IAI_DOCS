import api from "@/lib/api";
import type { SuccessResponse } from "@/lib/types";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  isActive: boolean;
  createdAt: string;
  expiresAt?: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

export interface CreateAnnouncementRequest {
  title: string;
  content: string;
  expiresAt?: string;
}

// Public endpoint - no auth required
export const getActiveAnnouncements = async (): Promise<Announcement[]> => {
  return api.get<Announcement[]>("/announcements");
};

// Admin-only endpoints
export const getAllAnnouncements = async (): Promise<Announcement[]> => {
  return api.get<Announcement[]>("/admin/announcements");
};

export const createAnnouncement = async (
  data: CreateAnnouncementRequest
): Promise<Announcement> => {
  return api.post<Announcement>("/admin/announcements", data);
};

export const deleteAnnouncement = async (id: string): Promise<SuccessResponse> => {
  return api.delete<SuccessResponse>(`/admin/announcements/${id}`);
};

export default {
  getActiveAnnouncements,
  getAllAnnouncements,
  createAnnouncement,
  deleteAnnouncement,
};
