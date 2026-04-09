import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  FlatList,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { CommentItem, type Comment } from "@/components/CommentItem";
import type { ForumPost } from "@/types";

// Fake comments data
const FAKE_COMMENTS: Comment[] = [
  {
    id: "comment-1",
    author: {
      firstName: "Alice",
      lastName: "Dupont",
    },
    content:
      "Excellente question ! Pour TCP/IP, je recommande de commencer par comprendre le modèle OSI avant de plonger dans les détails du protocole. Ça aide vraiment à visualiser comment tout fonctionne ensemble.",
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(), // 2 hours ago
    likes: 12,
    replies: [
      {
        id: "reply-1",
        author: {
          firstName: "Marc",
          lastName: "Martin",
        },
        content:
          "Merci Alice ! Tu aurais une ressource spécifique à recommander pour le modèle OSI ?",
        createdAt: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        likes: 3,
      },
      {
        id: "reply-2",
        author: {
          firstName: "Alice",
          lastName: "Dupont",
        },
        content:
          "Oui ! Il y a une super vidéo sur YouTube de la chaîne 'NetworkChuck'. Très pédagogique 👍",
        createdAt: new Date(Date.now() - 1800000).toISOString(), // 30 min ago
        likes: 5,
      },
    ],
  },
  {
    id: "comment-2",
    author: {
      firstName: "Jean",
      lastName: "Moreau",
    },
    content:
      "Pour UML, le livre 'UML 2 en action' de Pascal Roques est une référence. Couvre tous les diagrammes avec des exemples pratiques. Je l'ai utilisé pendant mes cours de génie logiciel !",
    createdAt: new Date(Date.now() - 7200000 * 3).toISOString(), // 6 hours ago
    likes: 8,
  },
  {
    id: "comment-3",
    author: {
      firstName: "Sophie",
      lastName: "Laurent",
    },
    content:
      "J'ai créé des fiches de révision sur les protocoles réseau si ça intéresse. MP moi !",
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
    likes: 15,
    replies: [
      {
        id: "reply-3",
        author: {
          firstName: "Lucas",
          lastName: "Bernard",
        },
        content: "Je suis preneur ! Merci d'avance 🙏",
        createdAt: new Date(Date.now() - 43200000).toISOString(), // 12 hours ago
        likes: 2,
      },
    ],
  },
  {
    id: "comment-4",
    author: {
      firstName: "Emma",
      lastName: "Petit",
    },
    content:
      "N'oubliez pas de pratiquer avec des outils comme Packet Tracer pour les réseaux. La théorie c'est bien, mais la pratique c'est mieux ! 💻",
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
    likes: 20,
  },
];

interface CommentModalProps {
  visible: boolean;
  post: ForumPost | null;
  onClose: () => void;
}

export function CommentModal({
  visible,
  post,
  onClose,
}: CommentModalProps) {
  const [newComment, setNewComment] = useState("");

  const handleSend = () => {
    if (!newComment.trim()) return;
    // TODO: Implement actual comment submission
    console.log("New comment:", newComment);
    setNewComment("");
  };

  if (!post) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50">
        {/* Header */}
        <View className="bg-surface pt-12 px-6 pb-4">
          <View className="flex-row items-center justify-between mb-3">
            <Text className="text-xl font-bold text-on-surface">
              Commentaires
            </Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          {/* Post Preview */}
          <View className="bg-neutral rounded-xl p-3 mb-2">
            <Text className="font-bold text-on-surface text-sm mb-1">
              {post.title}
            </Text>
            <Text className="text-secondary text-xs" numberOfLines={2}>
              {post.content}
            </Text>
          </View>

          {/* Comments Count */}
          <Text className="text-secondary text-sm">
            {FAKE_COMMENTS.length} réponse{FAKE_COMMENTS.length > 1 ? "s" : ""}
          </Text>
        </View>

        {/* Comments List */}
        <ScrollView className="flex-1 px-6 py-4 bg-surface">
          {FAKE_COMMENTS.map((comment) => (
            <CommentItem
              key={comment.id}
              comment={comment}
              onLike={(id) => console.log("Like comment:", id)}
              onReply={(comment) =>
                setNewComment(`@${comment.author.firstName} `)
              }
            />
          ))}
        </ScrollView>

        {/* Input */}
        <View className="bg-surface px-4 py-3 border-t border-neutral">
          <View className="flex-row items-center gap-2">
            <TextInput
              placeholder="Écrire un commentaire..."
              placeholderTextColor="#9CA3AF"
              value={newComment}
              onChangeText={setNewComment}
              multiline
              className="flex-1 bg-neutral rounded-xl px-4 py-2 text-on-surface max-h-[100px]"
            />
            <TouchableOpacity
              onPress={handleSend}
              className="w-10 h-10 bg-primary rounded-full items-center justify-center"
              activeOpacity={0.7}
            >
              <Ionicons name="send" size={18} color="white" />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
