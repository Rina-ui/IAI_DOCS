import { Pressable, Text, View } from "react-native";

interface SectionHeaderProps {
  title: string;
  action?: string;
  onActionPress?: () => void;
}

export default function SectionHeader({
  title,
  action = "Voir tout",
  onActionPress,
}: SectionHeaderProps) {
  return (
    <View className="flex-row justify-between items-center px-6 mb-4">
      <Text className="text-2xl font-bold text-on-surface">{title}</Text>
      {onActionPress && (
        <Pressable onPress={onActionPress}>
          <Text className="text-primary font-semibold">{action}</Text>
        </Pressable>
      )}
    </View>
  );
}
