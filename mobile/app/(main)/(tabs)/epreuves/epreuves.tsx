import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Dimensions, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import { examService } from "@/services/dataService";
import type { Exam } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { SubjectFilter } from "@/components/SubjectFilter";
import { ExamCard } from "@/components/ExamCard";
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';
import { SubjectList } from "../home/components/SubjectList";

const { width } = Dimensions.get('window');

const SUBJECTS = ["Toutes", "Mathematiques", "Physique", "Chimie", "Francais", "Histoire", "Philosophie", "Anglais", "SVT", "Informatique"];

export default function Epreuves() {
  const { user } = useAuth();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filtered, setFiltered] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");
  const [downloadingId, setDownloadingId] = useState<string | null>(null);

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await examService.getAll(user?.level);
      // Ne garder que les épreuves validées
      const validatedExams = data.filter(exam => exam.status === "validated");
      setExams(validatedExams);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  }, [user?.level]);

  useFocusEffect(
    useCallback(() => {
      fetchExams();
    }, [fetchExams])
  );

  useEffect(() => {
    let result = exams;
    if (selectedSubject !== "Toutes") {
      result = result.filter((e) => e.subject === selectedSubject);
    }
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter((e) => e.title.toLowerCase().includes(q) || e.subject.toLowerCase().includes(q));
    }
    setFiltered(result);
  }, [searchQuery, exams, selectedSubject]);

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

          <SubjectList />
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