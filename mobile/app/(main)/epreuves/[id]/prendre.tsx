import React, { useState, useCallback } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { examService, trainingService } from "@/services/dataService";
import type { Exam } from "@/types";
import type { Correction } from "@/services/training/training.types";
import { Ionicons } from "@expo/vector-icons";

export default function TakeExam() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();
  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [correction, setCorrection] = useState<Correction | null>(null);
  const [currentStep, setCurrentStep] = useState<"answering" | "submitting" | "result">(
    "answering"
  );

  React.useEffect(() => {
    if (!id) return;
    examService.getById(id).then((data) => {
      setExam(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, [id]);

  const handleAnswerChange = useCallback((questionId: string, answer: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: answer }));
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!exam || !exam.questions || exam.questions.length === 0) return;

    const answeredCount = Object.values(answers).filter((a) => a.trim()).length;
    if (answeredCount === 0) {
      Alert.alert("Attention", "Veuillez répondre à au moins une question avant de soumettre.");
      return;
    }

    Alert.alert(
      "Soumettre l'examen",
      `Vous avez répondu à ${answeredCount}/${exam.questions.length} questions. Voulez-vous soumettre pour correction IA ?`,
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Soumettre",
          onPress: async () => {
            setSubmitting(true);
            setCurrentStep("submitting");
            try {
              // Start training session
              const training = await trainingService.start(exam.id);

              // Format answers for submission
              const formattedAnswers = exam.questions!
                .filter((q) => answers[q.id]?.trim())
                .map((q) => ({
                  questionId: q.id,
                  answer: answers[q.id],
                }));

              // Submit for AI correction
              const correctionResult = await trainingService.submit(
                training.id,
                formattedAnswers
              );
              setCorrection(correctionResult);
              setCurrentStep("result");
            } catch (error) {
              console.error("[TakeExam] Submission error:", error);
              Alert.alert("Erreur", "Impossible de soumettre l'examen. Veuillez réessayer.");
              setCurrentStep("answering");
            } finally {
              setSubmitting(false);
            }
          },
        },
      ]
    );
  }, [exam, answers]);

  const answeredCount = Object.values(answers).filter((a) => a.trim()).length;

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#EAB308" />
      </View>
    );
  }

  if (!exam) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <Text className="text-secondary">Épreuve introuvable</Text>
      </View>
    );
  }

  // Result screen
  if (currentStep === "result" && correction) {
    return (
      <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
        <ScrollView contentContainerStyle={{ paddingBottom: 32 }}>
          {/* Header */}
          <View className="px-6 pt-4 pb-6 bg-surface">
            <View className="flex-row items-center mb-4">
              <TouchableOpacity
                className="w-9 h-9 bg-neutral rounded-full items-center justify-center mr-3"
                onPress={() => router.replace("/(main)/(tabs)/epreuves/epreuves")}
              >
                <Ionicons name="home-outline" size={16} color="#374151" />
              </TouchableOpacity>
              <Text className="text-on-surface text-lg font-bold flex-1">Résultat</Text>
            </View>
          </View>

          {/* Score Card */}
          <View className="px-6 mt-4">
            <View className="bg-surface rounded-xl p-6 border-2 border-primary items-center">
              <View className="w-20 h-20 rounded-full bg-primary/10 items-center justify-center mb-4">
                <Text className="text-primary text-3xl font-bold">{correction.percentage}%</Text>
              </View>
              <Text className="text-on-surface text-xl font-bold mb-1">
                Score : {correction.totalScore} pts
              </Text>
              <Text className="text-secondary text-center">
                {correction.percentage >= 50
                  ? "🎉 Félicitations, vous avez réussi !"
                  : "💪 Continuez à vous entraîner !"}
              </Text>
            </View>
          </View>

          {/* AI Explanation */}
          {correction.aiExplanation && (
            <View className="px-6 mt-4">
              <View className="bg-surface rounded-xl p-5 border border-neutral">
                <View className="flex-row items-center mb-3">
                  <Ionicons name="sparkles" size={20} color="#EAB308" />
                  <Text className="text-on-surface font-bold text-base ml-2">
                    Correction de l'IA
                  </Text>
                </View>
                <Text className="text-secondary text-base leading-relaxed">
                  {correction.aiExplanation}
                </Text>
              </View>
            </View>
          )}

          {/* Actions */}
          <View className="px-6 mt-6 gap-3">
            <TouchableOpacity
              className="bg-primary rounded-xl py-3.5 items-center"
              onPress={() => router.replace("/(main)/(tabs)/epreuves/epreuves")}
            >
              <Text className="text-white font-semibold text-base">
                Retour aux épreuves
              </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // Submitting screen
  if (currentStep === "submitting") {
    return (
      <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
        <View className="flex-1 items-center justify-center px-6">
          <ActivityIndicator size="large" color="#EAB308" />
          <Text className="text-on-surface font-semibold text-lg mt-6">
            Soumission en cours...
          </Text>
          <Text className="text-secondary text-center mt-2">
            L'IA corrige votre examen. Cela peut prendre quelques instants.
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  // Answering screen
  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      <View className="px-6 pt-4 pb-3 bg-surface">
        <View className="flex-row items-center justify-between mb-3">
          <TouchableOpacity
            className="w-9 h-9 bg-neutral rounded-full items-center justify-center"
            onPress={() => router.back()}
          >
            <Ionicons name="arrow-back" size={16} color="#374151" />
          </TouchableOpacity>
          <Text className="text-on-surface font-bold text-base">
            {exam.title}
          </Text>
        </View>

        {/* Progress bar */}
        <View className="bg-neutral rounded-full h-2.5 mb-2">
          <View
            className="bg-primary h-2.5 rounded-full"
            style={{ width: `${(answeredCount / (exam.questions?.length || 1)) * 100}%` }}
          />
        </View>
        <Text className="text-secondary text-xs">
          {answeredCount}/{exam.questions?.length || 0} questions répondus
        </Text>
      </View>

      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}>
        {exam.questions?.map((q, i) => (
          <View key={q.id} className="bg-surface rounded-xl p-5 mb-4 border border-neutral">
            <View className="flex-row items-start mb-3">
              <View className="w-7 h-7 bg-primary rounded-lg items-center justify-center mr-3">
                <Text className="text-white text-sm font-bold">{i + 1}</Text>
              </View>
              <Text className="text-on-surface text-base flex-1 leading-relaxed">
                {q.questionText}
              </Text>
            </View>
            <Text className="text-secondary text-xs mb-2 ml-10">{q.points} pts</Text>
            <TextInput
              className="bg-neutral rounded-xl px-4 py-3 text-on-surface text-base mt-2"
              placeholder="Votre réponse..."
              placeholderTextColor="#9CA3AF"
              value={answers[q.id] || ""}
              onChangeText={(text) => handleAnswerChange(q.id, text)}
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
          </View>
        ))}

        {/* Submit Button */}
        <TouchableOpacity
          className={`rounded-xl py-4 items-center mt-2 ${answeredCount > 0 ? "bg-primary" : "bg-neutral"
            }`}
          onPress={handleSubmit}
          disabled={answeredCount === 0 || submitting}
        >
          {submitting ? (
            <ActivityIndicator size="small" color="white" />
          ) : (
            <Text className="text-white font-bold text-base">
              Soumettre pour correction IA
            </Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
