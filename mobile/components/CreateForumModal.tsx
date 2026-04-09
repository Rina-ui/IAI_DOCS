import React, { useState } from "react";
import {
  View,
  Text,
  Modal,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { forumService } from "../services/forum/forumService";

interface CreateForumModalProps {
  visible: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function CreateForumModal({
  visible,
  onClose,
  onSuccess,
}: CreateForumModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!title.trim()) {
      Alert.alert("Erreur", "Veuillez entrer un titre pour votre discussion.");
      return;
    }
    if (!content.trim()) {
      Alert.alert("Erreur", "Veuillez entrer le contenu de votre discussion.");
      return;
    }

    try {
      setIsLoading(true);
      const newPost = await forumService.create(title.trim(), content.trim());
      
      if (newPost && newPost.id) {
        setTitle("");
        setContent("");
        onSuccess?.();
        onClose();
      } else {
        Alert.alert("Erreur", "Une erreur est survenue lors de la publication.");
      }
    } catch (error) {
      Alert.alert("Erreur", "Impossible de publier votre discussion.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View className="flex-1 bg-black/50 justify-end">
        <View className="bg-surface rounded-t-3xl max-h-[90%]">
          {/* Header */}
          <View className="flex-row items-center justify-between px-6 py-4 border-b border-neutral">
            <Text className="text-xl font-bold text-on-surface">
              Créer une discussion
            </Text>
            <TouchableOpacity onPress={handleClose}>
              <Ionicons name="close" size={24} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <ScrollView className="px-6 py-4">
            {/* Title Input */}
            <View className="mb-4">
              <Text className="text-on-surface font-semibold mb-2 text-sm">
                Titre
              </Text>
              <TextInput
                placeholder="Donnez un titre à votre discussion..."
                placeholderTextColor="#9CA3AF"
                value={title}
                onChangeText={setTitle}
                className="bg-neutral rounded-xl px-4 py-3 text-on-surface"
                maxLength={100}
              />
              <Text className="text-right text-xs text-secondary mt-1">
                {title.length}/100
              </Text>
            </View>

            {/* Content Input */}
            <View className="mb-6">
              <Text className="text-on-surface font-semibold mb-2 text-sm">
                Contenu
              </Text>
              <TextInput
                placeholder="Décrivez votre question ou sujet de discussion..."
                placeholderTextColor="#9CA3AF"
                value={content}
                onChangeText={setContent}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className="bg-neutral rounded-xl px-4 py-3 text-on-surface min-h-[120px]"
              />
            </View>

            {/* Tags Section (Optional) */}
            <View className="mb-6">
              <Text className="text-on-surface font-semibold mb-2 text-sm">
                Tags (optionnel)
              </Text>
              <View className="flex-row flex-wrap gap-2">
                {["Maths", "Physique", "Chimie", "Info", "Français"].map(
                  (tag) => (
                    <TouchableOpacity
                      key={tag}
                      className="bg-primary/10 px-3 py-1.5 rounded-full"
                    >
                      <Text className="text-primary text-xs font-medium">
                        {tag}
                      </Text>
                    </TouchableOpacity>
                  )
                )}
              </View>
            </View>
          </ScrollView>

          {/* Footer Actions */}
          <View className="px-6 py-4 border-t border-neutral flex-row gap-3">
            <TouchableOpacity
              onPress={handleClose}
              className="flex-1 bg-neutral py-3 rounded-xl"
            >
              <Text className="text-center text-secondary font-semibold">
                Annuler
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleSubmit}
              disabled={isLoading}
              className={`flex-1 py-3 rounded-xl ${
                isLoading ? "bg-primary/70" : "bg-primary"
              }`}
            >
              {isLoading ? (
                <ActivityIndicator color="white" />
              ) : (
                <Text className="text-center text-white font-semibold">
                  Publier
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
}
