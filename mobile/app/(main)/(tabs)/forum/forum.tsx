import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { forumService } from "@/services/dataService";
import type { ForumPost } from "@/types";
import { Ionicons } from "@expo/vector-icons";

import { SearchBar } from "@/components/SearchBar";
import { PostCard } from "@/components/PostCard";
import { CreateForumModal } from "@/components/CreateForumModal";

export default function Forum() {
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const [createModalVisible, setCreateModalVisible] = useState(false);

  const fetchPosts = useCallback(async () => {
    setLoading(true);
    try {
      const data = await forumService.getAll();
      setPosts(data);
    } catch (e) {
      console.error("[Forum] Error fetching posts:", e);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchPosts();
  }, [fetchPosts]);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Filter posts based on search
  const filteredPosts = posts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  const handlePostCreated = () => {
    fetchPosts();
  };

  return (
    <View className="flex-1 bg-neutral">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 bg-surface flex-row items-center justify-between">
          <Text className="text-2xl font-bold text-on-surface">Forum</Text>
          <TouchableOpacity>
            <Ionicons name="notifications-outline" size={24} color="#F7D117" />
          </TouchableOpacity>
        </View>

        {/* Search */}
        <SearchBar value={search} onChangeText={setSearch} />

        {/* Posts List */}
        {loading ? (
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#F7D117" />
          </View>
        ) : (
          <FlatList
            data={filteredPosts}
            keyExtractor={(item) => item.id}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                tintColor="#F7D117"
              />
            }
            contentContainerStyle={{ padding: 16, paddingBottom: 150 }}
            renderItem={({ item }) => (
              <PostCard
                post={item}
                onPress={() => router.push(`/forum/${item.id}`)}
              />
            )}
            ListEmptyComponent={
              <View className="items-center justify-center py-12">
                <Ionicons
                  name="chatbubbles-outline"
                  size={64}
                  color="#9CA3AF"
                />
                <Text className="text-on-surface font-semibold text-lg mt-4">
                  Aucune discussion trouvée
                </Text>
                <Text className="text-secondary text-sm mt-2 text-center px-6">
                  {search
                    ? `Aucun résultat pour "${search}"`
                    : "Soyez le premier à lancer une discussion !"}
                </Text>
              </View>
            }
          />
        )}
      </SafeAreaView>

      {/* Create Forum Modal */}
      <CreateForumModal
        visible={createModalVisible}
        onClose={() => setCreateModalVisible(false)}
        onSuccess={handlePostCreated}
      />

      {/* Floating Action Button */}
      <TouchableOpacity
        onPress={() => setCreateModalVisible(true)}
        className="absolute bottom-28 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg elevation-5"
        style={{
          shadowColor: "#0f172a",
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 6,
        }}
      >
        <Ionicons name="add" size={28} color="white" />
      </TouchableOpacity>
    </View>
  );
}