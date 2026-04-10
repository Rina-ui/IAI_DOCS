import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { captureRef } from "react-native-view-shot";
import * as Sharing from "expo-sharing";
import { forumService } from "@/services/dataService";
import type { ForumPost } from "@/types";

interface PostCardProps {
  post: ForumPost;
  onPress?: () => void;
}

export function PostCard({ post, onPress }: PostCardProps) {
  const viewRef = useRef(null);
  const [upvotes, setUpvotes] = useState(post.upvotes);
  const [isUpvoted, setIsUpvoted] = useState(false);

  const handleUpvote = async () => {
    // Optimistic update
    const previousUpvotes = upvotes;
    const previouslyUpvoted = isUpvoted;

    setUpvotes((prev) => (isUpvoted ? prev - 1 : prev + 1));
    setIsUpvoted(!isUpvoted);

    try {
      await forumService.upvote(post.id);
    } catch (error) {
      // Rollback on error
      setUpvotes(previousUpvotes);
      setIsUpvoted(previouslyUpvoted);
      console.error("Erreur lors de l'upvote:", error);
    }
  };

  // Sync local state if prop changes from parent
  React.useEffect(() => {
    setUpvotes(post.upvotes);
  }, [post.upvotes]);

  const authorName = post.author
    ? `${post.author.firstName} ${post.author.lastName}`
    : "Utilisateur";

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diffInDays = Math.floor((now.getTime() - date.getTime()) / 86400000);

    if (diffInDays === 0) return "Aujourd'hui";
    if (diffInDays === 1) return "Hier";
    if (diffInDays < 7) return `Il y a ${diffInDays}j`;
    return date.toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "short",
    });
  };

  const handleShare = async () => {
    try {
      if (!(await Sharing.isAvailableAsync())) {
        alert("Le partage n'est pas disponible sur cet appareil");
        return;
      }

      const uri = await captureRef(viewRef, {
        format: "png",
        quality: 1,
      });

      await Sharing.shareAsync(uri);
    } catch (error) {
      console.log("Erreur partage :", error);
    }
  };

  return (
    <View ref={viewRef} collapsable={false}>
      <TouchableOpacity
        activeOpacity={0.7}
        className="bg-surface rounded-2xl p-4 mb-3 shadow-sm"
        onPress={onPress}
      >
        {/* Header */}
        <View className="flex-row items-center mb-3">
          <Image
            source={require("@/assets/images/avatar.jpg")}
            className="w-10 h-10 rounded-full"
          />
          <View className="ml-3 flex-1">
            <Text className="font-semibold text-on-surface">{authorName}</Text>
            <Text className="text-xs text-secondary">
              {formatDate(post.createdAt)}
            </Text>
          </View>
        </View>

        {/* Title */}
        <Text className="font-bold text-on-surface text-base mb-1">
          {post.title}
        </Text>

        {/* Content */}
        <Text
          className="text-secondary text-sm leading-5 mb-3"
          numberOfLines={3}
        >
          {post.content}
        </Text>

        {/* Actions */}
        <View className="flex-row items-center justify-between pt-2 border-t border-neutral">
          <View className="flex-row items-center gap-4">
            <TouchableOpacity
              className="flex-row items-center"
              onPress={handleUpvote}
            >
              <Ionicons
                name={isUpvoted ? "heart" : "heart-outline"}
                size={20}
                color={isUpvoted ? "#EF4444" : "#9CA3AF"}
              />
              <Text
                className={`ml-1 font-medium ${isUpvoted ? "text-primary" : "text-on-surface"
                  }`}
              >
                {upvotes}
              </Text>
            </TouchableOpacity>

            <View className="flex-row items-center">
              <Ionicons name="chatbubble-outline" size={18} color="#9CA3AF" />
              <Text className="ml-1 text-secondary">Commenter</Text>
            </View>
          </View>

          {/* Share */}
          <TouchableOpacity activeOpacity={0.7} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  );
}