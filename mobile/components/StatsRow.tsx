import { Text, View } from "react-native";

interface StatItemProps {
  number: string;
  label: string;
  backgroundColor: string;
}

interface StatsRowProps {
  stats: StatItemProps[];
}

function StatItem({ number, label, backgroundColor }: StatItemProps) {
  return (
    <View className={`flex-1 rounded-2xl p-4 ${backgroundColor}`}>
      <Text className="text-3xl font-bold text-white">{number}</Text>
      <Text className="text-white text-lg mt-1">{label}</Text>
    </View>
  );
}

export default function StatsRow({ stats }: StatsRowProps) {
  return (
    <View className="flex-row gap-3 px-6 mb-6">
      {stats.map((stat, idx) => (
        <StatItem key={idx} {...stat} />
      ))}
    </View>
  );
}
