import React, { useEffect, useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  RefreshControl,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useLocalSearchParams, useRouter } from "expo-router";
import { forumService } from "@/services/dataService";
import type { ForumPost, ForumReply } from "@/services/forum/forum.types";
import { Ionicons } from "@expo/vector-icons";
import { useAuth } from "@/contexts/AuthContext";

export default function ForumPostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [post, setPost] = useState<ForumPost | null>(null);
  const [replies, setReplies] = useState<ForumReply[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [replyContent, setReplyContent] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const fetchPost = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const data = await forumService.getById(id);
      setPost(data);
      setReplies(data.replies || []);
    } catch (error) {
      console.error("[ForumPostDetail] Error fetching post:", error);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useFocusEffect(
    useCallback(() => {
      fetchPost();
    }, [fetchPost])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await fetchPost();
    setRefreshing(false);
  };

  const handleUpvote = async () => {
    if (!post) return;
    try {
      const updated = await forumService.upvote(post.id);
      setPost(updated);
    } catch (error) {
      console.error(error);
    }
  };

  const handleUpvoteReply = async (replyId: string) => {
    try {
      const updated = await forumService.upvoteReply(replyId);
      setReplies((prev) =>
        prev.map((r) => (r.id === replyId ? updated : r))
      );
    } catch (error) {
      console.error(error);
    }
  };

  const handleSendReply = async () => {
    if (!replyContent.trim() || !post) return;
    setSubmitting(true);
    try {
      const newReply = await forumService.reply(post.id, replyContent.trim());
      setReplies((prev) => [...prev, newReply]);
      setReplyContent("");
      Alert.alert("Succès", "Votre réponse a été publiée");
    } catch (error) {
      Alert.alert("Erreur", "Impossible d'envoyer votre réponse");
    } finally {
      setSubmitting(false);
    }
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

  if (loading)
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#F7D117" />
      </View>
    );

  if (!post)
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-secondary">Post introuvable</Text>
      </View>
    );

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EAB308" />
        }
      >
        {/* Header */}
        <View className="px-6 pt-4 pb-4 bg-surface">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity
              className="w-9 h-9 bg-neutral rounded-full items-center justify-center mr-3"
              onPress={() => router.back()}
            >
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
              <View>
                <Text className="text-on-surface font-medium">
                  {post.author
                    ? `${post.author.firstName} ${post.author.lastName}`
                    : "Membre"}
                </Text>
                <Text className="text-secondary text-xs">{formatDate(post.createdAt)}</Text>
              </View>
            </View>

            <Text className="text-on-surface font-bold text-base mb-3">{post.title}</Text>
            <Text className="text-secondary text-lg leading-relaxed">{post.content}</Text>

            <View className="flex-row items-center justify-between mt-4 pt-4 border-t border-neutral">
              <TouchableOpacity
                className="flex-row items-center bg-primary/5 px-3 py-2 rounded-lg"
                onPress={handleUpvote}
              >
                <Ionicons name="arrow-up" size={14} color="#F7D117" />
                <Text className="text-primary text-sm font-semibold ml-1">{post.upvotes}</Text>
                <Text className="text-secondary text-xs ml-2">upvotes</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Replies Section */}
        <View className="px-6 mt-6">
          <Text className="text-on-surface font-bold text-lg mb-4">
            Réponses ({replies.length})
          </Text>

          {replies.length === 0 ? (
            <View className="bg-surface rounded-xl p-6 items-center border border-neutral">
              <Ionicons name="chatbubble-ellipses-outline" size={40} color="#9CA3AF" />
              <Text className="text-secondary text-center mt-3">
                Aucune réponse pour le moment.{"\n"}Soyez le premier à répondre !
              </Text>
            </View>
          ) : (
            replies.map((reply) => (
              <View key={reply.id} className="bg-surface rounded-xl p-4 mb-3 border border-neutral">
                <View className="flex-row items-center mb-2">
                  <View className="w-8 h-8 bg-primary/10 rounded-full items-center justify-center mr-2">
                    <Ionicons name="person" size={14} color="#F7D117" />
                  </View>
                  <View className="flex-1">
                    <Text className="text-on-surface text-sm font-medium">
                      {reply.author
                        ? `${reply.author.firstName} ${reply.author.lastName}`
                        : "Membre"}
                    </Text>
                    <Text className="text-secondary text-xs">{formatDate(reply.createdAt)}</Text>
                  </View>
                </View>
                <Text className="text-secondary text-base leading-relaxed">{reply.content}</Text>
                <View className="flex-row items-center mt-3 pt-3 border-t border-neutral">
                  <TouchableOpacity
                    className="flex-row items-center bg-primary/5 px-3 py-1.5 rounded-lg"
                    onPress={() => handleUpvoteReply(reply.id)}
                  >
                    <Ionicons name="arrow-up" size={12} color="#F7D117" />
                    <Text className="text-primary text-xs font-semibold ml-1">{reply.upvotes}</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>

        {/* Back */}
        <View className="px-6 mt-4">
          <TouchableOpacity
            className="bg-surface border border-neutral rounded-xl py-3 items-center"
            onPress={() => router.back()}
          >
            <Text className="text-on-surface font-medium">Retour au forum</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Reply Input Bar */}
      <View className="bg-surface border-t border-neutral px-4 py-3">
        <View className="flex-row items-center gap-2">
          <TextInput
            className="flex-1 bg-neutral rounded-xl px-4 py-3 text-on-surface text-base"
            placeholder="Écrire une réponse..."
            placeholderTextColor="#9CA3AF"
            value={replyContent}
            onChangeText={setReplyContent}
            multiline
            maxLength={2000}
          />
          <TouchableOpacity
            className={`w-11 h-11 rounded-full items-center justify-center ${replyContent.trim() && !submitting ? "bg-primary" : "bg-neutral"
              }`}
            onPress={handleSendReply}
            disabled={!replyContent.trim() || submitting}
          >
            {submitting ? (
              <ActivityIndicator size="small" color="#F7D117" />
            ) : (
              <Ionicons name="send" size={18} color={replyContent.trim() ? "white" : "#9CA3AF"} />
            )}
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}
