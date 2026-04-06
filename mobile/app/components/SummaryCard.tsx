import Ionicons from "@expo/vector-icons/Ionicons";
import { Text, View } from "react-native";

interface SummaryCardProps {
  title: string;
  description: string;
  badge?: string;
  productivity?: string;
}

export default function SummaryCard({
  title,
  description,
  badge = "RÉSUMÉ IA",
  productivity = "Productivité en hausse",
}: SummaryCardProps) {
  return (
    <View className="mx-6 mb-6 rounded-2xl bg-primary p-6 overflow-hidden">
      <View className="flex-row justify-between items-start mb-4">
        <View>
          <Ionicons name="sparkles" size={32} color="white" />
        </View>
        <View className="bg-primary/40 rounded-lg px-3 py-1">
          <Text className="text-white text-xs font-semibold">{badge}</Text>
        </View>
      </View>

      <Text className="text-white text-2xl font-bold mb-2">{title}</Text>
      <Text className="text-white/90 text-sm leading-5 mb-4">
        {description}
      </Text>

      <View className="flex-row items-center gap-1">
        <Ionicons name="trending-up" size={16} color="white" />
        <Text className="text-white text-sm font-semibold">{productivity}</Text>
      </View>
    </View>
  );
}
