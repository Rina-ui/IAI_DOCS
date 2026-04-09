import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ForumPost } from "@/types";

interface ForumActivityListProps {
  topPosts: ForumPost[];
}

export function ForumActivityList({ topPosts }: ForumActivityListProps) {
  const router = useRouter();

  return (
    <View className="mt-4 mb-6">
      <View className="flex-row justify-between items-center mb-3 px-6">
        <Text className="text-on-surface font-semibold text-base">
          {topPosts.length > 0 ? "Discussions" : "Forum"}
        </Text>
        <TouchableOpacity onPress={() => router.push("/(main)/forum/forum")}>
          <Text className="text-primary text-lg font-medium">Voir tout</Text>
        </TouchableOpacity>
      </View>

      {topPosts.length === 0 ? (
        <View className="mx-6 bg-surface rounded-xl p-5 items-center border border-neutral">
          <Ionicons name="chatbubbles-outline" size={28} color="#9CA3AF" />
          <Text className="text-on-surface font-medium text-lg mt-2 mb-1">
            Pas encore de discussions
          </Text>
          <Text className="text-secondary text-xs text-center">
            Lancez la première discussion
          </Text>
        </View>
      ) : (
        <View className="bg-surface rounded-xl mx-6">
          {topPosts.map((post, index) => (
            <TouchableOpacity
              key={post.id}
              className={`px-4 py-3 ${index < topPosts.length - 1 ? "border-b border-neutral" : ""
                }`}
              onPress={() => router.push("/(main)/forum/forum")}
            >
              <View className="flex-row items-center mb-1.5">
                <Text className="text-on-surface font-medium text-lg flex-1" numberOfLines={1}>
                  {post.title}
                </Text>
                <View className="flex-row items-center bg-primary/5 px-2 py-1 rounded-md ml-2">
                  <Ionicons name="arrow-up" size={12} color="#1e3a8a" />
                  <Text className="text-primary text-xs font-semibold ml-0.5">
                    {post.upvotes}
                  </Text>
                </View>
              </View>
              <Text className="text-secondary text-xs" numberOfLines={1}>
                {post.content}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
}
