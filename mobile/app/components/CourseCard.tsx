import { Image, Pressable, Text, View } from "react-native";

interface CourseCardProps {
  title: string;
  category: string;
  image: any;
  onPress?: () => void;
}

export default function CourseCard({
  title,
  category,
  image,
  onPress,
}: CourseCardProps) {
  return (
    <Pressable
      onPress={onPress}
      className="flex-1 rounded-2xl overflow-hidden bg-white"
    >
      <Image source={image} className="w-full h-32 bg-neutral" />
      <View className="p-3">
        <Text className="text-xs text-secondary font-semibold mb-1">
          {category}
        </Text>
        <Text className="text-sm font-bold text-on-surface">{title}</Text>
      </View>
    </Pressable>
  );
}
