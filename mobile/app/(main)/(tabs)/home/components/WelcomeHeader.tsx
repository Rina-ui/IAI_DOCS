import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

interface WelcomeHeaderProps {
  firstName?: string;
  examsCount: number;
  level?: string;
  points?: number;
}

export function WelcomeHeader({
  firstName,
  examsCount,
  level,
  points,
}: WelcomeHeaderProps) {
  const router = useRouter();

  const hour = new Date().getHours();
  const greeting =
    hour < 12 ? "Bonjour" : hour < 18 ? "Bon après-midi" : "Bonsoir";

  return (
    <View className="px-6 pt-6">
      <View className="flex-row justify-between items-center mb-4">
        <View>
          <Text className="text-secondary text-xl font-medium">{greeting}</Text>
          <Text className="text-on-surface text-2xl font-bold mt-0.5">
            {firstName || "Utilisateur"} 👋
          </Text>
        </View>
        <TouchableOpacity
          className="w-12 h-12 bg-primary p-2 rounded-full justify-center items-center"
          onPress={() => router.push("/(main)/profile/profile")}
        >
          <Ionicons name="person" size={20} className="text-white" />
        </TouchableOpacity>
      </View>


    </View>
  );
}


