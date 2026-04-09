import { api } from "../api";
import type { ForumPost } from "./forum.types";

export const forumService = {
  async getAll(): Promise<ForumPost[]> {
    try {
      console.log("[ForumService] Fetching forum posts");
      const response = await api.get<ForumPost[]>("/forum");
      console.log("[ForumService] Received", response.data.length, "posts");
      return response.data;
    } catch (error) {
      console.error("[ForumService] Fetch forum posts error:", error);
      return [];
    }
  },

  async create(title: string, content: string): Promise<ForumPost> {
    try {
      const response = await api.post<ForumPost>("/forum", { title, content });
      return response.data;
    } catch (error) {
      console.error("[ForumService] Create post error:", error);
      return {} as ForumPost;
    }
  },

  async upvote(id: string): Promise<ForumPost> {
    try {
      const response = await api.patch<ForumPost>(`/forum/${id}/upvote`);
      return response.data;
    } catch (error) {
      console.error("[ForumService] Upvote post error:", error);
      return {} as ForumPost;
    }
  },
};
