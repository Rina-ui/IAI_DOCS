import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";

interface StatsCardProps {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string | number;
  color?: string;
  size?: "sm" | "md";
}

export function StatsCard({
  icon,
  label,
  value,
  color = "#EAB308",
  size = "sm",
}: StatsCardProps) {
  const isSmall = size === "sm";

  return (
    <View className="bg-surface rounded-xl p-3 flex-row items-center gap-3">
      <View
        className="rounded-full items-center justify-center"
        style={{
          width: isSmall ? 40 : 48,
          height: isSmall ? 40 : 48,
          backgroundColor: `${color}15`,
        }}
      >
        <Ionicons name={icon} size={isSmall ? 20 : 24} color={color} />
      </View>
      <View className="flex-1">
        <Text className="text-secondary text-xs">{label}</Text>
        <Text className="text-on-surface font-bold text-lg">{value}</Text>
      </View>
    </View>
  );
}
