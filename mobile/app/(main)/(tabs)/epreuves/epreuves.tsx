import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect, useRouter, useLocalSearchParams } from "expo-router";
import { examService } from "@/services/dataService";
import type { Exam } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { SubjectFilter } from "@/components/SubjectFilter";
import { ExamCard } from "@/components/ExamCard";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SubjectList } from "../home/components/SubjectList";
import { levelToFiliere } from "@/utils/levelToFiliere";

const { width } = Dimensions.get('window');

const ALL_LEVELS = ["Tous niveaux", "6eme", "5eme", "4eme", "3eme", "Seconde", "Premiere", "Terminale", "L1", "L2", "L3", "Master"];

export default function Epreuves() {
  const { user } = useAuth();
  const router = useRouter();
  const params = useLocalSearchParams();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filtered, setFiltered] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Toutes");
  const [selectedLevel, setSelectedLevel] = useState("Tous niveaux");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);
  const [showLevelDropdown, setShowLevelDropdown] = useState(false);

  const userFiliere = levelToFiliere(user?.level);
  const selectedFiliere = levelToFiliere(selectedLevel === "Tous niveaux" ? user?.level : selectedLevel);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const levelParam = selectedLevel === "Tous niveaux" ? undefined : selectedLevel;
      const subjectParam = selectedSubject === "Toutes" ? undefined : selectedSubject;
      const data = await examService.getAll(levelParam, subjectParam);
      // Ne garder que les épreuves validées
      const validatedExams = data.filter(exam => exam.status === "validated");
      setExams(validatedExams);
      setFiltered(validatedExams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [selectedLevel, selectedSubject]);

  // Auto-apply subject filter from navigation params
  useEffect(() => {
    if (params.subject && typeof params.subject === "string") {
      setSelectedSubject(params.subject);
    }
  }, [params.subject]);

  // Fetch exams: on mount, on screen focus, and when filters change
  useFocusEffect(
    useCallback(() => {
      fetchExams();
    }, [fetchExams])
  );

  // Filter by search query only (client-side)
  useEffect(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const result = exams.filter((e) =>
        e.title.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q)
      );
      setFiltered(result);
    } else {
      setFiltered(exams);
    }
  }, [searchQuery, exams]);

  const onRefresh = async () => { setRefreshing(true); await fetchExams(); setRefreshing(false); };

  const handleDownload = async (exam: Exam) => {
    try {
      setDownloadingId(exam.id);

      // Utiliser fileUrl de l'interface Exam
      if (!exam.fileUrl) {
        Alert.alert("Erreur", "Ce fichier n'est pas disponible au téléchargement");
        return;
      }

      // Extraire l'extension du fichier
      const fileExtension = exam.fileUrl.split('.').pop()?.toLowerCase() || 'pdf';
      const fileName = `${exam.title}_${exam.subject}_${exam.year}.${fileExtension}`;
      const downloadPath = `${FileSystem.documentDirectory}${fileName}`;

      // Télécharger le fichier
      const downloadResumable = FileSystem.createDownloadResumable(
        exam.fileUrl,
        downloadPath,
        {}
      );

      const result = await downloadResumable.downloadAsync();

      if (result && result.uri) {
        // Vérifier si le partage est disponible
        const isSharingAvailable = await Sharing.isAvailableAsync();

        if (isSharingAvailable) {
          await Sharing.shareAsync(result.uri, {
            dialogTitle: `Partager ${exam.title}`,
            mimeType: fileExtension === 'pdf' ? 'application/pdf' : 'application/octet-stream',
          });
        } else {
          Alert.alert(
            "Téléchargement terminé",
            `Le fichier "${exam.title}" a été téléchargé avec succès`,
            [{ text: "OK" }]
          );
        }
      }
    } catch (error) {
      console.error("Erreur de téléchargement:", error);
      Alert.alert("Erreur", "Impossible de télécharger le fichier. Veuillez réessayer.");
    } finally {
      setDownloadingId(null);
    }
  };
  const handleClearSubjectFilter = () => {
    setSelectedSubject("Toutes");
  };

  const handleClearLevelFilter = () => {
    setSelectedLevel("Tous niveaux");
  };

  const rows = [];
  for (let i = 0; i < filtered.length; i += 2) {
    rows.push(filtered.slice(i, i + 2));
  }

  return (
    <View className="flex-1 bg-neutral">
      <SafeAreaView className="flex-1" edges={["top"]}>
        {/* Header */}
        <View className="px-6 py-4 bg-surface">
          <Text className="text-on-surface font-bold text-2xl text-center mb-4">
            Épreuves disponibles
          </Text>

          {/* Active filters */}
          {(selectedSubject !== "Toutes" || selectedLevel !== "Tous niveaux") && (
            <View className="flex-row flex-wrap gap-2 mb-2">
              {selectedLevel !== "Tous niveaux" && (
                <View className="flex-row items-center bg-blue-500/10 rounded-xl px-3 py-2">
                  <Ionicons name="school" size={14} color="#3B82F6" />
                  <Text className="text-blue-700 text-xs ml-1 font-medium">{selectedLevel}</Text>
                  <TouchableOpacity onPress={handleClearLevelFilter} className="ml-2">
                    <Ionicons name="close" size={14} color="#3B82F6" />
                  </TouchableOpacity>
                </View>
              )}
              {selectedSubject !== "Toutes" && (
                <View className="flex-row items-center bg-primary/10 rounded-xl px-3 py-2">
                  <Ionicons name="filter" size={14} color="#EAB308" />
                  <Text className="text-on-surface text-xs ml-1 font-medium">{selectedSubject}</Text>
                  <TouchableOpacity onPress={handleClearSubjectFilter} className="ml-2">
                    <Ionicons name="close" size={14} color="#EAB308" />
                  </TouchableOpacity>
                </View>
              )}
            </View>
          )}

          {/* Barre de recherche */}
          <View className="bg-neutral rounded-xl px-4 py-3 mb-2">
            <View className="flex-row items-center">
              <Ionicons name="search-outline" size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 text-on-surface text-base ml-3"
                placeholder="Rechercher une épreuve..."
                placeholderTextColor="#9CA3AF"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
              {searchQuery.length > 0 && (
                <TouchableOpacity onPress={() => setSearchQuery("")} className="ml-2">
                  <Ionicons name="close-circle" size={20} color="#9CA3AF" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {/* Level filter dropdown */}
          <View className="mb-2">
            <TouchableOpacity
              className="flex-row items-center justify-between bg-neutral rounded-xl px-4 py-3"
              onPress={() => setShowLevelDropdown(!showLevelDropdown)}
            >
              <View className="flex-row items-center">
                <Ionicons name="school" size={18} color="#94a3b8" />
                <Text className="text-on-surface text-sm ml-2">{selectedLevel}</Text>
              </View>
              <Ionicons name={showLevelDropdown ? "chevron-up" : "chevron-down"} size={18} color="#94a3b8" />
            </TouchableOpacity>

            {showLevelDropdown && (
              <View className="bg-surface rounded-xl mt-1 border border-neutral shadow-lg">
                <ScrollView style={{ maxHeight: 200 }}>
                  {ALL_LEVELS.map((level) => (
                    <TouchableOpacity
                      key={level}
                      className={`flex-row items-center px-4 py-3 border-b border-neutral/30 ${level === selectedLevel ? "bg-primary/10" : ""
                        }`}
                      onPress={() => {
                        setSelectedLevel(level);
                        setShowLevelDropdown(false);
                      }}
                    >
                      {level === selectedLevel && (
                        <Ionicons name="checkmark" size={18} color="#EAB308" className="mr-2" />
                      )}
                      <Text
                        className={`text-sm ml-2 ${level === selectedLevel ? "text-primary font-semibold" : "text-on-surface"
                          }`}
                      >
                        {level}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            )}
          </View>

          <SubjectList filiere={selectedFiliere} />
        </View>

        {/* Liste des épreuves */}
        <ScrollView
          className=" pt-4"
          contentContainerStyle={{ paddingBottom: 150 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EAB308" />}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View className="items-center py-20">
              <ActivityIndicator size="large" color="#EAB308" />
              <Text className="text-secondary mt-3">Chargement des épreuves...</Text>
            </View>
          ) : filtered.length === 0 ? (
            <View className="items-center py-20">
              <View className="bg-neutral rounded-full p-6 mb-4">
                <Ionicons name="document-text-outline" size={48} color="#9CA3AF" />
              </View>
              <Text className="text-on-surface font-semibold text-lg mb-2">Aucune épreuve trouvée</Text>
              <Text className="text-secondary text-center px-8">
                {searchQuery ? `Aucun résultat pour "${searchQuery}"` : `Aucune épreuve de niveau ${user?.level} disponible`}
              </Text>
              {searchQuery && (
                <TouchableOpacity className="bg-primary px-6 py-3 rounded-xl mt-6" onPress={() => setSearchQuery("")}>
                  <Text className="text-white font-medium">Effacer la recherche</Text>
                </TouchableOpacity>
              )}
            </View>
          ) : (
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
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}