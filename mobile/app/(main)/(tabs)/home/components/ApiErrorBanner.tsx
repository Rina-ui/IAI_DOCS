import React from "react";
import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";

export function ApiErrorBanner({ onRetry }: { onRetry: () => void }) {
  return (
    <View className="mx-6 mt-2 mb-2 bg-red-50 border border-red-100 rounded-xl p-4">
      <View className="flex-row items-center">
        <Ionicons name="warning" size={18} color="#DC2626" />
        <Text className="text-red-600 font-semibold ml-2 flex-1">
          Problème de connexion
        </Text>
      </View>
      <Text className="text-red-500 text-lg mt-1">
        Vérifiez que le backend est démarré.
      </Text>
      <TouchableOpacity
        className="bg-red-600 rounded-lg px-4 py-2 mt-3 self-start"
        onPress={onRetry}
      >
        <Text className="text-white text-lg font-medium">Réessayer</Text>
      </TouchableOpacity>
    </View>
  );
}
