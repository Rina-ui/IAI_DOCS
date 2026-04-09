import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { ForumPost } from "@/types";
import { PostCard } from "@/components/PostCard";

interface ForumActivityListProps {
  topPosts: ForumPost[];
}

export function ForumActivityList({ topPosts }: ForumActivityListProps) {
  const router = useRouter();
 
  
  return (
    <View className="mt-4">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 px-6">
        <View className="flex-row items-center">
          <View className="w-1 h-6 bg-primary rounded-full mr-2" />
          <Text className="text-on-surface font-bold text-xl">
            {topPosts.length > 0 ? "Discussions" : "Forum"}
          </Text>
        </View>
        <TouchableOpacity
          onPress={() => router.push("/(main)/forum/forum")}
          activeOpacity={0.7}
          className="flex-row items-center"
        >
          <Text className="text-primary font-semibold text-sm mr-1">Tout voir</Text>
          <Ionicons name="arrow-forward" size={14} color="#EAB308" />
        </TouchableOpacity>
      </View>

      {/* Empty state */}
      {topPosts.length === 0 ? (
        <View className="mx-6 bg-surface rounded-2xl p-8 items-center">
          <View className="w-16 h-16 rounded-full bg-primary/10 items-center justify-center mb-4">
            <Ionicons name="chatbubbles-outline" size={30} color="#EAB308" />
          </View>
          <Text className="text-on-surface font-bold text-base mb-1">
            Pas encore de discussions
          </Text>
          <Text className="text-secondary text-sm text-center mb-5">
            Soyez le premier à lancer une discussion !
          </Text>
          <TouchableOpacity
            onPress={() => router.push("/(main)/forum/forum")}
            activeOpacity={0.8}
            className="bg-primary px-6 py-2.5 rounded-xl"
          >
            <Text className="text-white font-semibold text-sm">
              Créer une discussion
            </Text>
          </TouchableOpacity>
        </View>
      ) : (
        <View className="px-6 gap-3">
          {topPosts.map((post) => (
            <PostCard
            key={post.id}
                            post={post}
                            
                          />
          ))}
        </View>
      )}
    </View>
  );
}