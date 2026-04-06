import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";

export default function App() {
  return (
    <View className="flex-1 items-center justify-center px-6">
      <Text className="text-xl font-bold text-on-surface">
        Should Be auth or onboarding
      </Text>
      <Pressable
        className="mt-6 rounded-lg bg-primary px-5 py-3"
        onPress={() => router.push("/(main)/home/home")}
      >
        <Text className="font-semibold text-on-primary">Aller vers Main</Text>
      </Pressable>
    </View>
  );
}
