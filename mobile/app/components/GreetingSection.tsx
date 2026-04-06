import { Text, View } from "react-native";

interface GreetingSectionProps {
  userName: string;
  subtitle?: string;
}

export default function GreetingSection({
  userName,
  subtitle = "Prêt pour votre session d'étude aujourd'hui ?",
}: GreetingSectionProps) {
  return (
    <View className="bg-white px-6 py-4">
      <Text className="text-4xl font-bold text-on-surface">
        Bonjour {userName}
      </Text>
      <Text className="text-base text-on-surface mt-2">{subtitle}</Text>
    </View>
  );
}
