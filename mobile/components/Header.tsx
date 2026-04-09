import Ionicons from "@expo/vector-icons/Ionicons";
import { Pressable, Text, View } from "react-native";

interface HeaderProps {
  logo?: React.ReactNode;
  title?: string;
  showNotification?: boolean;
}

export default function Header({
  title = "The Academic Curator",
  showNotification = true,
}: HeaderProps) {
  return (
    <View className="flex-row items-center justify-between bg-white px-6 py-4">
      <View className="flex-row items-center gap-2">
        <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
          <Text className="text-white font-bold text-lg">A</Text>
        </View>
        <Text className="text-lg font-bold text-on-surface">{title}</Text>
      </View>
      {showNotification && (
        <Pressable>
          <Ionicons name="notifications-outline" size={24} color="#F7D117" />
        </Pressable>
      )}
    </View>
  );
}
