import React from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";

export interface Comment {
  id: string;
  author: {
    firstName: string;
    lastName: string;
    avatar?: string;
  };
  content: string;
  createdAt: string;
  likes: number;
  replies?: Comment[];
}

interface CommentItemProps {
  comment: Comment;
  onLike?: (id: string) => void;
  onReply?: (comment: Comment) => void;
  isReply?: boolean;
}

export function CommentItem({ comment, onLike, onReply, isReply = false }: CommentItemProps) {
  const authorName = `${comment.author.firstName} ${comment.author.lastName}`;

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / 3600000);

    if (diffInHours < 1) return "À l'instant";
    if (diffInHours < 24) return `Il y a ${diffInHours}h`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  return (
    <View className={`${isReply ? "ml-12 mt-2" : "mb-4"}`}>
      <View className="flex-row items-start">
        <Image
          source={
            comment.author.avatar
              ? { uri: comment.author.avatar }
              : require("@/assets/images/avatar.jpg")
          }
          className="w-9 h-9 rounded-full"
        />
        <View className="flex-1 ml-3">
          {/* Author Info */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center flex-1">
              <Text className="font-semibold text-on-surface text-sm">
                {authorName}
              </Text>
              <Text className="text-secondary text-xs ml-2">
                {formatDate(comment.createdAt)}
              </Text>
            </View>
          </View>

          {/* Comment Content */}
          <View className="bg-neutral rounded-xl px-3 py-2 mt-2">
            <Text className="text-on-surface text-sm leading-5">
              {comment.content}
            </Text>
          </View>

          {/* Actions */}
          <View className="flex-row items-center gap-4 mt-2">
            <TouchableOpacity
              onPress={() => onLike?.(comment.id)}
              className="flex-row items-center"
              activeOpacity={0.7}
            >
              <Ionicons
                name={comment.likes > 0 ? "heart" : "heart-outline"}
                size={16}
                color={comment.likes > 0 ? "#EF4444" : "#9CA3AF"}
              />
              <Text className="ml-1 text-xs text-secondary">
                {comment.likes}
              </Text>
            </TouchableOpacity>

            {!isReply && (
              <TouchableOpacity
                onPress={() => onReply?.(comment)}
                activeOpacity={0.7}
              >
                <Text className="text-xs text-primary font-medium">
                  Répondre
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Replies */}
          {comment.replies && comment.replies.length > 0 && (
            <View className="mt-3">
              {comment.replies.map((reply) => (
                <CommentItem
                  key={reply.id}
                  comment={reply}
                  onLike={onLike}
                  onReply={onReply}
                  isReply
                />
              ))}
            </View>
          )}
        </View>
      </View>
    </View>
  );
}
