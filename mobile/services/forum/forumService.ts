import { api } from "../api";
import type { ForumPost, ForumReply } from "./forum.types";

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

  async getById(id: string): Promise<ForumPost> {
    try {
      console.log("[ForumService] Fetching post by id:", id);
      const response = await api.get<ForumPost>(`/forum/${id}`);
      console.log("[ForumService] Received post:", response.data.title);
      return response.data;
    } catch (error) {
      console.error("[ForumService] Get post by id error:", error);
      return {} as ForumPost;
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

  async reply(postId: string, content: string): Promise<ForumReply> {
    try {
      const response = await api.post<ForumReply>(`/forum/${postId}/replies`, { content });
      return response.data;
    } catch (error) {
      console.error("[ForumService] Reply to post error:", error);
      return {} as ForumReply;
    }
  },

  async upvoteReply(id: string): Promise<ForumReply> {
    try {
      const response = await api.patch<ForumReply>(`/forum/replies/${id}/upvote`);
      return response.data;
    } catch (error) {
      console.error("[ForumService] Upvote reply error:", error);
      return {} as ForumReply;
    }
  },
};
