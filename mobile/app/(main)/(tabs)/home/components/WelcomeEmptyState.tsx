import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function WelcomeEmptyState() {
  const router = useRouter();

  return (
    <View className="px-6 mt-2">
      <View className="bg-surface rounded-xl p-5 mb-6">
        <View className="flex-row items-center mb-3">
          <View className="w-10 h-10 bg-primary/10 rounded-lg items-center justify-center mr-3">
            <Ionicons name="rocket" size={20} color="#1e3a8a" />
          </View>
          <Text className="text-on-surface text-base font-bold">
            Bienvenue sur IAI Docs
          </Text>
        </View>
        <Text className="text-secondary text-lg leading-relaxed mb-4">
          Les épreuves seront ajoutées prochainement par vos enseignants.
          Explorez le forum en attendant.
        </Text>
        <TouchableOpacity
          className="bg-primary rounded-lg py-2.5 items-center"
          onPress={() => router.push("/(main)/forum/forum")}
        >
          <Text className="text-on-primary text-lg font-medium">
            Explorer le forum
          </Text>
        </TouchableOpacity>
      </View>

      <Text className="text-on-surface font-semibold text-lg mb-3">
        Pour bien démarrer
      </Text>
      <View className="bg-surface rounded-xl overflow-hidden">
        <TipCard
          icon="school"
          title="Révisez régulièrement"
          color="#1e3a8a"
        />
        <TipCard
          icon="bulb"
          title="Correction IA"
          color="#10b981"
        />
        <TipCard
          icon="people"
          title="Entraide"
          color="#7c3aed"
        />
      </View>
    </View>
  );
}

function TipCard({
  icon,
  title,
  color,
}: {
  icon: string;
  title: string;
  color: string;
}) {
  return (
    <View className="flex-row items-center px-4 py-3 border-b border-neutral last:border-0">
      <Ionicons name={icon as any} size={16} color={color} />
      <Text className="text-on-surface text-lg ml-3 flex-1">{title}</Text>
      <Ionicons name="chevron-forward" size={16} color="#9CA3AF" />
    </View>
  );
}
