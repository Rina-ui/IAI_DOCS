import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

interface DocumentItemProps {
  title: string;
  modifiedTime: string;
  type?: "pdf" | "docx" | "csv" | "default";
  onPress?: () => void;
}

const iconMap = {
  pdf: "document",
  docx: "document",
  csv: "pie-chart",
  default: "document-outline",
};

const colorMap = {
  pdf: "#1e3a8a",
  docx: "#1e3a8a",
  csv: "#1e3a8a",
  default: "#6d7698",
};

export default function DocumentItem({
  title,
  modifiedTime,
  type = "default",
  onPress,
}: DocumentItemProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-row items-center gap-4 px-6 py-4 border-b border-neutral"
    >
      <View className="w-10 h-10 rounded-lg bg-primary/10 items-center justify-center">
        <Ionicons
          name={iconMap[type] as any}
          size={20}
          color={colorMap[type]}
        />
      </View>
      <View >
        <Text className="text-base font-semibold text-on-surface">{title}</Text>
        <Text className="text-xs text-secondary mt-1">{modifiedTime}</Text>
      </View>
    </Pressable>
  );
}
