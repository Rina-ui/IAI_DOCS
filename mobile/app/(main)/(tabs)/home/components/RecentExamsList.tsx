import React from "react";
import { View, Text, ScrollView, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { Exam } from "@/types";

interface RecentExamsListProps {
  recentExams: Exam[];
  getSubjectColor: (subject: string) => string;
  getSubjectIcon: (subject: string) => keyof typeof Ionicons.glyphMap;
  formatRelativeDate: (dateStr: string) => string;
}

export function RecentExamsList({
  recentExams,
  getSubjectColor,
  getSubjectIcon,
  formatRelativeDate,
}: RecentExamsListProps) {
  const router = useRouter();

  if (recentExams.length === 0) return null;

  return (
    <View className="mt-4">
      <View className="px-6 mb-3">
        <Text className="text-on-surface font-semibold text-base">
          Récentes
        </Text>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 24, gap: 10 }}>
        {recentExams.map((exam) => (
          <TouchableOpacity
            key={exam.id}
            className="w-48 bg-surface rounded-xl p-4 border border-neutral"
            onPress={() => router.push("/(main)/epreuves/epreuves")}
          >
            <View className="flex-row items-center mb-3">
              <View
                className="w-8 h-8 rounded-lg items-center justify-center mr-2"
                style={{ backgroundColor: getSubjectColor(exam.subject) + "15" }}
              >
                <Ionicons
                  name={getSubjectIcon(exam.subject)}
                  size={16}
                  color={getSubjectColor(exam.subject)}
                />
              </View>
              <Text
                className="text-secondary text-xs flex-1"
                numberOfLines={1}
              >
                {exam.subject}
              </Text>
            </View>
            <Text className="text-on-surface font-medium text-lg mb-2" numberOfLines={2}>
              {exam.title}
            </Text>
            <View className="flex-row items-center justify-between">
              <Text className="text-secondary text-xs">{exam.year}</Text>

            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}
