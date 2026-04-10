import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useRouter } from "expo-router";
import { ExamCard } from "@/components/ExamCard";
import type { Exam } from "@/types";

interface RecentExamsListProps {
  recentExams: Exam[];
}

export function RecentExamsList({
  recentExams,
}: RecentExamsListProps) {
  const router = useRouter();

  if (recentExams.length === 0) return null;

  const displayExams = recentExams.slice(0, 8);

  // Créer des lignes de 2
  const rows = [];
  for (let i = 0; i < displayExams.length; i += 2) {
    rows.push(displayExams.slice(i, i + 2));
  }

  return (
    <View className="mt-4">
      {/* Header */}
      <View className="flex-row items-center justify-between px-6 mb-3">
        <Text className="text-base font-bold text-on-surface">
          Épreuves récentes Ajoutées
        </Text>

        <TouchableOpacity
          onPress={() => router.push("/(main)/epreuves/epreuves")}
        >
          <Text className="text-xs font-semibold text-primary">
            Voir tout
          </Text>
        </TouchableOpacity>
      </View>

      {/* Liste */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24 }}
      >
        {rows.map((row, rowIndex) => (
          <View
            key={rowIndex}
            className="flex-row justify-between mb-5"
            style={{ gap: 12 }}
          >
            {row.map((exam) => (
              <ExamCard
                key={exam.id}
                exam={exam}
                onPress={() =>
                  router.push(`/epreuves/${exam.id}`)
                }
              />
            ))}

            {/* Si 1 seul élément */}
            {row.length === 1 && <View className="flex-1" />}
          </View>
        ))}
      </ScrollView>
    </View>
  );
}