import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { forumService } from "@/services/dataService";
import type { ForumPost } from "@/types";
import { Ionicons } from "@expo/vector-icons";

export default function ForumPostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    forumService.getAll().then((data) => {
      const found = data.find((p) => p.id === id);
      setPost(found || null);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleUpvote = async () => {
    if (!post) return;
    try {
      const updated = await forumService.upvote(post.id);
      setPost(updated);
    } catch (error) { console.error(error); }
  };

  const formatDate = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
    const days = Math.floor(h / 24);
    if (h < 1) return "À l'instant";
    if (h < 24) return `Il y a ${h}h`;
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days}j`;
    return new Date(d).toLocaleDateString("fr-FR");
  };

  if (loading) return <View className="flex-1 bg-surface items-center justify-center"><ActivityIndicator size="large" color="#F7D117" /></View>;
  if (!post) return <View className="flex-1 bg-surface items-center justify-center"><Text className="text-secondary">Post introuvable</Text></View>;

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-4 bg-surface">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity className="w-9 h-9 bg-neutral rounded-full items-center justify-center mr-3" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={16} color="#374151" />
            </TouchableOpacity>
            <Text className="text-on-surface text-lg font-bold flex-1">Discussion</Text>
          </View>
        </View>

        {/* Post */}
        <View className="px-6 mt-3">
          <View className="bg-surface rounded-xl p-5 border border-neutral">
            <View className="flex-row items-center mb-3">
              <View className="w-10 h-10 bg-primary/10 rounded-full items-center justify-center mr-3">
                <Ionicons name="person" size={18} color="#F7D117" />
              </View>
              <View >
                <Text className="text-on-surface font-medium text-lg">Membre</Text>
                <Text className="text-secondary text-xs">{formatDate(post.createdAt)}</Text>
              </View>
            </View>

            <Text className="text-on-surface font-bold text-base mb-3">{post.title}</Text>
            <Text className="text-secondary text-lg leading-relaxed">{post.content}</Text>

            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-neutral">
              <TouchableOpacity className="flex-row items-center bg-primary/5 px-3 py-2 rounded-lg" onPress={handleUpvote}>
                <Ionicons name="arrow-up" size={14} color="#F7D117" />
                <Text className="text-primary text-lg font-semibold ml-1">{post.upvotes}</Text>
                <Text className="text-secondary text-xs ml-2">upvotes</Text>
              </TouchableOpacity>
              <TouchableOpacity className="flex-row items-center">
                <Ionicons name="share-outline" size={16} color="#6B7280" />
                <Text className="text-secondary text-xs ml-1">Partager</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Back */}
        <View className="px-6 mt-4">
          <TouchableOpacity className="bg-surface border border-neutral rounded-xl py-3 items-center" onPress={() => router.back()}>
            <Text className="text-on-surface font-medium text-lg">Retour au forum</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
