import React, { useEffect, useState } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, Linking } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { examService } from "@/services/dataService";
import type { Exam } from "@/types";
import { Ionicons } from "@expo/vector-icons";

const SUBJECT_COLORS: Record<string, string> = {
  Mathematiques: "#1e3a8a", Physique: "#7c3aed", Chimie: "#059669", Francais: "#dc2626",
  Histoire: "#d97706", Philosophie: "#4f46e5", Anglais: "#0891b2", SVT: "#16a34a", Informatique: "#2563eb",
};

const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Mathematiques: "calculator", Physique: "nuclear", Chimie: "flask", Francais: "book",
  Histoire: "time", Philosophie: "school", Anglais: "globe", SVT: "leaf", Informatique: "code-slash",
};

export default function ExamDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    examService.getById(id).then((data) => { setExam(data); setLoading(false); }).catch(() => setLoading(false));
  }, [id]);

  if (loading) return <View className="flex-1 bg-surface items-center justify-center"><ActivityIndicator size="large" color="#1e3a8a" /></View>;
  if (!exam) return <View className="flex-1 bg-surface items-center justify-center"><Text className="text-secondary">Épreuve introuvable</Text></View>;

  const color = SUBJECT_COLORS[exam.subject] || "#6d7698";
  const icon = SUBJECT_ICONS[exam.subject] || "document-text";
  const totalPoints = exam.questions?.reduce((s, q) => s + q.points, 0) || 0;

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
        {/* Header */}
        <View className="px-6 pt-4 pb-5 bg-surface">
          <View className="flex-row items-center mb-4">
            <TouchableOpacity className="w-9 h-9 bg-neutral rounded-full items-center justify-center mr-3" onPress={() => router.back()}>
              <Ionicons name="arrow-back" size={16} color="#374151" />
            </TouchableOpacity>
            <Text className="text-on-surface text-lg font-bold flex-1">Détails</Text>
          </View>

          <View className="flex-row items-center mb-3">
            <View className="w-12 h-12 rounded-xl items-center justify-center mr-3" style={{ backgroundColor: color + "15" }}>
              <Ionicons name={icon} size={22} color={color} />
            </View>
            <View >
              <Text className="text-on-surface font-bold text-base">{exam.title}</Text>
              <Text className="text-secondary text-xs mt-0.5">{exam.subject} • {exam.year}</Text>
            </View>
          </View>

          <View className="flex-row gap-2">
            <Tag icon="school" label={exam.level} />
            <Tag icon="document-text" label={`${exam.questions?.length || 0} questions`} />
            <Tag icon="star" label={`${totalPoints} pts`} />
          </View>
        </View>

        {/* Questions */}
        {exam.questions && exam.questions.length > 0 && (
          <View className="mt-4 px-6">
            <Text className="text-on-surface font-semibold text-lg mb-3">Questions</Text>
            <View className="gap-2">
              {exam.questions.map((q, i) => (
                <View key={q.id} className="bg-surface rounded-xl p-4 border border-neutral">
                  <View className="flex-row items-start mb-2">
                    <View className="w-6 h-6 bg-primary rounded-md items-center justify-center mr-2 mt-0.5">
                      <Text className="text-on-primary text-xs font-bold">{i + 1}</Text>
                    </View>
                    <Text className="text-on-surface text-lg flex-1 leading-relaxed">{q.questionText}</Text>
                  </View>
                  <View className="flex-row justify-between ml-8">
                    <Text className="text-secondary text-xs">{q.points} point{q.points > 1 ? "s" : ""}</Text>
                  </View>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Actions */}
        <View className="px-6 mt-6 gap-3">
          {exam.fileUrl && (
            <TouchableOpacity className="bg-primary rounded-xl py-3 items-center" onPress={() => Linking.openURL(exam.fileUrl)}>
              <View className="flex-row items-center">
                <Ionicons name="download-outline" size={18} color="white" />
                <Text className="text-on-primary font-medium text-lg ml-2">Télécharger le PDF</Text>
              </View>
            </TouchableOpacity>
          )}
          <TouchableOpacity className="bg-surface border border-primary rounded-xl py-3 items-center" onPress={() => router.back()}>
            <Text className="text-primary font-medium text-lg">Retour aux épreuves</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

function Tag({ icon, label }: { icon: string; label: string }) {
  return (
    <View className="bg-neutral rounded-lg px-2.5 py-1.5 flex-row items-center">
      <Ionicons name={icon as any} size={12} color="#6B7280" />
      <Text className="text-secondary text-xs ml-1">{label}</Text>
    </View>
  );
}
