import React from "react";
import { View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import type { SubjectGroup } from "@/types";

const TEMP_STATIC_SUBJECTS: SubjectGroup[] = [
  {
    subject: "Réseaux Informatiques",
    count: 5,
    exams: []
  },
  {
    subject: "Génie Logiciel",
    count: 4,
    exams: []
  },
  {
    subject: "Bases de Données",
    count: 3,
    exams: []
  },
  {
    subject: "Développement Web",
    count: 6,
    exams: []
  },
  {
    subject: "Programmation",
    count: 5,
    exams: []
  },
  {
    subject: "Systèmes d'Exploitation",
    count: 3,
    exams: []
  },
  {
    subject: "Sécurité Informatique",
    count: 2,
    exams: []
  },
  {
    subject: "Intelligence Artificielle",
    count: 2,
    exams: []
  },
];

interface SubjectListProps {
  subjectGroups?: SubjectGroup[];
  getSubjectIcon?: (subject: string) => keyof typeof Ionicons.glyphMap;
}

export function SubjectList({
  subjectGroups,
  getSubjectIcon,
}: SubjectListProps) {
  const router = useRouter();

  // Fusionner les données du backend avec les données statiques temporaires
  const mergedSubjects = React.useMemo(() => {
    const backendMap = new Map(
      subjectGroups?.map(group => [group.subject, group])
    );

    const backendSubjects = new Set(backendMap.keys());

    const tempSubjects = TEMP_STATIC_SUBJECTS.filter(
      temp => !backendSubjects.has(temp.subject)
    );

    return [...subjectGroups || [], ...tempSubjects];
  }, [subjectGroups]);

  if (mergedSubjects.length === 0) return null;

  return (
    <View className="mt-3">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4 px-6">
        <View className="flex-row items-center">
          <Text className="text-on-surface font-bold text-xl">Matières</Text>
        </View>
      </View>

      {/* Circles Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {mergedSubjects.map((group, index) => {
          return (
            <TouchableOpacity
              key={`${group.subject}-${index}`}
              onPress={() => router.push("/(main)/epreuves/epreuves")}
              activeOpacity={0.7}
              className="items-center"
            >
              <View
                className={`w-16 h-16 rounded-full overflow-hidden mb-2`}
              >
                <Image
                  source={require("@/assets/images/mat.jpg")}
                  className="w-full h-full"
                  resizeMode="cover"
                />
              </View>

              {/* Subject name */}
              <Text
                className="text-on-surface text-xs text-center font-medium"
                numberOfLines={2}
              >
                {group.subject.substring(0, 12)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );
}