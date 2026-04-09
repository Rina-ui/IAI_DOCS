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

// DONNÉES STATIQUES TEMPORAIRES
const TEMP_STATIC_EXAMS: Exam[] = [
  {
    id: "temp-1",
    title: "Examen Réseaux - Modèle OSI & TCP/IP",
    subject: "Réseaux Informatiques",
    year: 2024,
    level: "Licence 2",
    fileUrl: "temp-url-1",
    uploadedById: "temp-user",
    status: "validated",
    createdAt: new Date().toISOString(),
  },
  {
    id: "temp-2",
    title: "Génie Logiciel - UML & Design Patterns",
    subject: "Génie Logiciel",
    year: 2024,
    level: "Licence 3",
    fileUrl: "temp-url-2",
    uploadedById: "temp-user",
    status: "validated",
    createdAt: new Date().toISOString(),
  },
  {
    id: "temp-3",
    title: "Bases de Données - SQL & Modélisation",
    subject: "Bases de Données",
    year: 2023,
    level: "Licence 2",
    fileUrl: "temp-url-3",
    uploadedById: "temp-user",
    status: "validated",
    createdAt: new Date().toISOString(),
  },
  {
    id: "temp-4",
    title: "Programmation Web - React & API REST",
    subject: "Développement Web",
    year: 2024,
    level: "Licence 3",
    fileUrl: "temp-url-4",
    uploadedById: "temp-user",
    status: "validated",
    createdAt: new Date().toISOString(),
  },
  {
    id: "temp-5",
    title: "Administration Système - Linux",
    subject: "Systèmes d'Exploitation",
    year: 2023,
    level: "Licence 2",
    fileUrl: "temp-url-5",
    uploadedById: "temp-user",
    status: "validated",
    createdAt: new Date().toISOString(),
  },
];

interface RecentExamsListProps {
  recentExams: Exam[];
}

export function RecentExamsList({
  recentExams,
}: RecentExamsListProps) {
  const router = useRouter();

  const allExams = React.useMemo(() => {
    const existingIds = new Set(recentExams.map((exam) => exam.id));
    const newStaticExams = TEMP_STATIC_EXAMS.filter(
      (temp) => !existingIds.has(temp.id)
    );
    return [...recentExams, ...newStaticExams];
  }, [recentExams]);

  const displayExams = allExams.slice(0, 8);

  if (displayExams.length === 0) return null;

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