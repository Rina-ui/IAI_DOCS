import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  RefreshControl,
  Alert,
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
import { CommentModal } from "@/components/CommentModal";

// PLACEHOLDER_POSTS avec données variées
const PLACEHOLDER_POSTS: ForumPost[] = [
  {
    id: "fake-1",
    title: "Comment réussir en Réseaux Informatiques ?",
    content:
      "Partagez vos astuces pour comprendre TCP/IP. Je cherche des ressources et des conseils pratiques pour mieux maîtriser les concepts de networking.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    upvotes: 12,
    authorId: "user-1",
    author: { firstName: "Alex", lastName: "Durand" },
  },
  {
    id: "fake-2",
    title: "Ressources Génie Logiciel",
    content:
      "Quels livres pour UML ? Je suis à la recherche de bonnes ressources pour maîtriser les diagrammes de classe et de séquence.",
    createdAt: new Date(Date.now() - 3600000 * 5).toISOString(),
    upvotes: 8,
    authorId: "user-2",
    author: { firstName: "Marie", lastName: "Leroy" },
  },
  {
    id: "fake-3",
    title: "Aide Algorithmique - Tri Fusion",
    content:
      "Quelqu'un peut-il m'expliquer le tri fusion de manière simple ? J'ai du mal à comprendre la partie récursive de l'algorithme.",
    createdAt: new Date(Date.now() - 86400000).toISOString(),
    upvotes: 15,
    authorId: "user-3",
    author: { firstName: "Thomas", lastName: "Petit" },
  },
  {
    id: "fake-4",
    title: "Stage Développement Web",
    content:
      "Je cherche un stage de 3 mois en développement web. Des pistes ou des entreprises qui recrutent des stagiaires ?",
    createdAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    upvotes: 23,
    authorId: "user-4",
    author: { firstName: "Julie", lastName: "Moreau" },
  },
  {
    id: "fake-5",
    title: "Python vs Java pour débuter ?",
    content:
      "Quel langage recommandez-vous pour apprendre la programmation ? J'hésite entre Python et Java pour mon premier langage.",
    createdAt: new Date(Date.now() - 86400000 * 3).toISOString(),
    upvotes: 19,
    authorId: "user-5",
    author: { firstName: "Lucas", lastName: "Martin" },
  },
  {
    id: "fake-6",
    title: "Projet Base de Données - Aide",
    content:
      "Je dois créer une base de données pour un système de gestion de bibliothèque. Des conseils sur la modélisation Merise ?",
    createdAt: new Date(Date.now() - 86400000 * 5).toISOString(),
    upvotes: 7,
    authorId: "user-6",
    author: { firstName: "Emma", lastName: "Bernard" },
  },
];

export default function Forum() {
  const { user } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState("");

  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [commentModalVisible, setCommentModalVisible] = useState(false);
  const [selectedPost, setSelectedPost] = useState<ForumPost | null>(null);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const data = await forumService.getAll();
      setPosts(data);
    } catch (e) {
      // Silently fail, will use placeholder posts
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPosts();
    setRefreshing(false);
  };

  // Combine real and placeholder posts
  const finalPosts =
    posts.length > 0 ? [...posts, ...PLACEHOLDER_POSTS] : PLACEHOLDER_POSTS;

  // Filter posts based on search
  const filteredPosts = finalPosts.filter(
    (p) =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.content.toLowerCase().includes(search.toLowerCase())
  );

  const openComments = (post: ForumPost) => {
    setSelectedPost(post);
    setCommentModalVisible(true);
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
            renderItem={({ item }) => <PostCard post={item} />}
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
                  Soyez le premier à lancer une discussion sur ce sujet !
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
        onSuccess={fetchPosts}
      />

      {/* Comment Modal */}
      <CommentModal
        visible={commentModalVisible}
        post={selectedPost}
        onClose={() => setCommentModalVisible(false)}
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