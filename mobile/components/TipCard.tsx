import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface TipCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  description: string;
  color: string;
}

export function TipCard({ icon, title, description, color }: TipCardProps) {
  // Since we pass generic color hex codes, we might still need some inline styles for dynamic colors, 
  // but overall structure will use className
  return (
    <View className="flex-row items-center px-4 py-4 border-b border-neutral/50">
      <View
        className="w-12 h-12 rounded-xl justify-center items-center mr-4"
        style={{ backgroundColor: color + "20" }}
      >
        <Ionicons name={icon} size={24} color={color} />
      </View>
      <View >
        <Text className="text-on-surface font-semibold text-base mb-1">
          {title}
        </Text>
        <Text className="text-secondary text-lg leading-5">
          {description}
        </Text>
      </View>
    </View>
  );
}
