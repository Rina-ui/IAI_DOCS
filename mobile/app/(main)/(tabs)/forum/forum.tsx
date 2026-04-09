import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Modal, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { forumService } from "@/services/dataService";
import type { ForumPost } from "@/types";
import { Ionicons } from "@expo/vector-icons";

const SUGGESTED = [
  { title: "Astuces Bac", description: "Méthodes de révision", icon: "trophy", color: "#d97706" },
  { title: "Entraide Maths", description: "Problèmes difficiles", icon: "calculator", color: "#1e3a8a" },
  { title: "Ressources", description: "Livres et sites utiles", icon: "bookmark", color: "#059669" },
];

export default function Forum() {
  const { user } = useAuth();
  const router = useRouter();
  const [posts, setPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newContent, setNewContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPosts = async () => {
    setLoading(true);
    try { const data = await forumService.getAll(); setPosts(data); }
    catch (error) { console.error(error); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchPosts(); }, []);

  const onRefresh = async () => { setRefreshing(true); await fetchPosts(); setRefreshing(false); };

  const handleCreate = async () => {
    if (!newTitle.trim() || !newContent.trim()) { Alert.alert("Erreur", "Remplissez tous les champs"); return; }
    setSubmitting(true);
    try {
      const post = await forumService.create(newTitle.trim(), newContent.trim());
      setPosts([post, ...posts]);
      setNewTitle(""); setNewContent(""); setModalVisible(false);
    } catch (error: any) {
      Alert.alert("Erreur", error.response?.data?.message || "Erreur");
    } finally { setSubmitting(false); }
  };

  const handleUpvote = async (postId: string) => {
    try {
      const updated = await forumService.upvote(postId);
      setPosts(posts.map((p) => (p.id === postId ? updated : p)));
    } catch (error) { console.error(error); }
  };

  const formatDate = (d: string) => {
    const h = Math.floor((Date.now() - new Date(d).getTime()) / 3600000);
    const d2 = Math.floor(h / 24);
    if (h < 1) return "À l'instant";
    if (h < 24) return `Il y a ${h}h`;
    if (d2 === 1) return "Hier";
    if (d2 < 7) return `Il y a ${d2}j`;
    return new Date(d).toLocaleDateString("fr-FR");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      {/* Header */}
      <View className="px-6 pt-4 pb-4 bg-surface">
        <View className="flex-row items-center justify-between">
          <Text className="text-on-surface text-xl font-bold">Forum</Text>
          <TouchableOpacity className="flex-row items-center bg-primary px-3 py-2 rounded-lg" onPress={() => setModalVisible(true)}>
            <Ionicons name="add" size={16} color="white" />
            <Text className="text-on-primary text-xs font-medium ml-1">Nouveau</Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Content */}
      <ScrollView className="px-6 pt-4" refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}>
        {loading ? (
          <View className="items-center py-20"><ActivityIndicator size="large" color="#1e3a8a" /></View>
        ) : posts.length === 0 ? (
          <View className="items-center py-12">
            <Ionicons name="chatbubbles-outline" size={48} color="#9CA3AF" />
            <Text className="text-on-surface font-semibold mt-3">Pas de discussion</Text>
            <Text className="text-secondary text-lg text-center mt-1 px-8">Soyez le premier à poster</Text>
            <TouchableOpacity className="bg-primary px-5 py-2 rounded-lg mt-4" onPress={() => setModalVisible(true)}>
              <Text className="text-on-primary text-lg font-medium">Créer un post</Text>
            </TouchableOpacity>
            <View className="mt-8 w-full gap-2">
              <Text className="text-on-surface font-medium text-lg text-center mb-1">Suggestions</Text>
              {SUGGESTED.map((t) => (
                <TouchableOpacity key={t.title} className="bg-surface rounded-xl p-3 border border-neutral flex-row items-center" onPress={() => { setNewTitle(t.title); setModalVisible(true); }}>
                  <View className="w-8 h-8 rounded-lg items-center justify-center mr-3" style={{ backgroundColor: t.color + "15" }}>
                    <Ionicons name={t.icon as any} size={16} color={t.color} />
                  </View>
                  <View >
                    <Text className="text-on-surface text-lg font-medium">{t.title}</Text>
                    <Text className="text-secondary text-xs">{t.description}</Text>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        ) : (
          <View className="gap-2 pb-6">
            {posts.map((post) => (
              <TouchableOpacity key={post.id} className="bg-surface rounded-xl p-4 border border-neutral" onPress={() => router.push({ pathname: "/(main)/forum/[id]", params: { id: post.id } })}>
                <View className="flex-row items-start">
                  <View className="w-9 h-9 bg-primary/10 rounded-full items-center justify-center mr-3">
                    <Ionicons name="person" size={16} color="#1e3a8a" />
                  </View>
                  <View >
                    <Text className="text-on-surface font-medium text-lg">{post.title}</Text>
                    <Text className="text-secondary text-xs mt-1 leading-relaxed" numberOfLines={2}>{post.content}</Text>
                    <View className="flex-row items-center justify-between mt-3">
                      <Text className="text-secondary text-xs">{formatDate(post.createdAt)}</Text>
                      <TouchableOpacity className="flex-row items-center bg-primary/5 px-2 py-1 rounded-md" onPress={() => handleUpvote(post.id)}>
                        <Ionicons name="arrow-up" size={12} color="#1e3a8a" />
                        <Text className="text-primary text-xs font-semibold ml-1">{post.upvotes}</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>

      {/* Create Modal */}
      <Modal visible={modalVisible} animationType="slide" transparent onRequestClose={() => setModalVisible(false)}>
        <View className="flex-1 justify-end bg-black/40">
          <View className="bg-surface rounded-t-2xl px-6 pt-5 pb-8">
            <View className="flex-row items-center justify-between mb-5">
              <Text className="text-on-surface text-lg font-bold">Nouveau post</Text>
              <TouchableOpacity onPress={() => setModalVisible(false)}><Ionicons name="close" size={22} color="#6B7280" /></TouchableOpacity>
            </View>
            <Text className="text-on-surface text-xs font-medium mb-1.5">Titre</Text>
            <View className="border border-neutral rounded-lg px-3 py-2.5 mb-4">
              <TextInput className="text-on-surface text-lg" placeholder="Titre de votre discussion" placeholderTextColor="#9CA3AF" value={newTitle} onChangeText={setNewTitle} />
            </View>
            <Text className="text-on-surface text-xs font-medium mb-1.5">Contenu</Text>
            <View className="border border-neutral rounded-lg px-3 py-2.5 mb-5">
              <TextInput className="text-on-surface text-lg" placeholder="Votre message..." placeholderTextColor="#9CA3AF" value={newContent} onChangeText={setNewContent} multiline style={{ minHeight: 80 }} textAlignVertical="top" />
            </View>
            <TouchableOpacity className="bg-primary rounded-xl py-3 items-center" onPress={handleCreate} disabled={submitting} activeOpacity={0.8}>
              {submitting ? <ActivityIndicator color="white" /> : <Text className="text-on-primary font-medium text-lg">Publier</Text>}
            </TouchableOpacity>
            <View style={{ height: 8 }} />
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}
