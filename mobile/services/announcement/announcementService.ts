import { api } from "../api";

export interface Announcement {
  id: string;
  title: string;
  content: string;
  type: string;
  authorId: string;
  expiresAt?: string;
  createdAt: string;
  author?: {
    firstName: string;
    lastName: string;
  };
}

export const announcementService = {
  async getAll(): Promise<Announcement[]> {
    try {
      console.log("[AnnouncementService] Fetching active announcements");
      const response = await api.get<Announcement[]>("/announcements");
      console.log("[AnnouncementService] Received", response.data.length, "announcements");
      return response.data;
    } catch (error) {
      console.error("[AnnouncementService] Fetch announcements error:", error);
      return [];
    }
  },
};
