import api from "@/lib/api";
import type { ForumPost, CreateForumPostRequest, SuccessResponse } from "@/lib/types";

export interface ForumReply {
  id: string;
  content: string;
  postId: string;
  authorId: string;
  author?: {
    firstName: string;
    lastName: string;
  };
  votes: number;
  createdAt: string;
  upvotedByUser?: boolean;
}

export interface ForumPostWithReplies extends ForumPost {
  replies: ForumReply[];
}

export const getForumPosts = async (): Promise<ForumPost[]> => {
  return api.get<ForumPost[]>("/forum");
};

export const getForumPost = async (id: string): Promise<ForumPostWithReplies> => {
  return api.get<ForumPostWithReplies>(`/forum/${id}`);
};

export const createForumPost = async (
  data: CreateForumPostRequest
): Promise<ForumPost> => {
  return api.post<ForumPost>("/forum", data);
};

export const replyToPost = async (
  postId: string,
  content: string
): Promise<ForumReply> => {
  return api.post<ForumReply>(`/forum/${postId}/replies`, { content });
};

export const upvoteForumPost = async (id: string): Promise<ForumPost> => {
  return api.patch<ForumPost>(`/forum/${id}/upvote`);
};

export const upvoteReply = async (id: string): Promise<ForumReply> => {
  return api.patch<ForumReply>(`/forum/replies/${id}/upvote`);
};

export default {
  getForumPosts,
  getForumPost,
  createForumPost,
  replyToPost,
  upvoteForumPost,
  upvoteReply,
};
