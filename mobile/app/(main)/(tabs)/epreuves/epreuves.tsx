import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator, RefreshControl, TextInput, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useFocusEffect, useRouter } from "expo-router";
import { examService } from "@/services/dataService";
import type { Exam } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from 'expo-linear-gradient';

const { width } = Dimensions.get('window');

const SUBJECTS = ["Toutes", "Mathematiques", "Physique", "Chimie", "Francais", "Histoire", "Philosophie", "Anglais", "SVT", "Informatique"];

const SUBJECT_COLORS: Record<string, string> = {
  Mathematiques: "#1e3a8a", Physique: "#7c3aed", Chimie: "#059669", Francais: "#dc2626",
  Histoire: "#d97706", Philosophie: "#4f46e5", Anglais: "#0891b2", SVT: "#16a34a", Informatique: "#2563eb",
};

const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Mathematiques: "calculator", Physique: "nuclear", Chimie: "flask", Francais: "book",
  Histoire: "time", Philosophie: "school", Anglais: "globe", SVT: "leaf", Informatique: "code-slash",
};

export default function Epreuves() {
  const { user } = useAuth();
  const router = useRouter();
  const [exams, setExams] = useState<Exam[]>([]);
  const [filtered, setFiltered] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState("Toutes");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchExams = useCallback(async () => {
    setLoading(true);
    try {
      const data = await examService.getAll(user?.level);
      setExams(data);
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

  const getSubjectColor = (s: string) => SUBJECT_COLORS[s] || "#6d7698";
  const getSubjectIcon = (s: string) => SUBJECT_ICONS[s] || "document-text";

  const formatDate = (d?: string) => {
    if (!d) return "";
    const date = new Date(d);
    if (isNaN(date.getTime())) return "";
    const diff = Math.floor((Date.now() - date.getTime()) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return "Hier";
    if (diff < 7) return `Il y a ${diff}j`;
    return date.toLocaleDateString("fr-FR");
  };

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      {/* Header avec gradient */}
      <LinearGradient
        colors={['#ffffff', '#f8fafc']}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        className="px-6 pt-4 pb-6"
      >
        <Text className="text-2xl font-bold text-gray-800 mb-2">📚 Épreuves</Text>
        <Text className="text-sm text-gray-500 mb-4">
          {filtered.length} épreuve{filtered.length > 1 ? "s" : ""} disponible{filtered.length > 1 ? "s" : ""}
        </Text>

        {/* Barre de recherche améliorée */}
        <View className="bg-white rounded-2xl px-4 py-3 shadow-sm mb-4" style={{
          shadowColor: "#000",
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 8,
          elevation: 2,
        }}>
          <View className="flex-row items-center">
            <Ionicons name="search-outline" size={20} color="#94a3b8" />
            <TextInput 
              className="flex-1 text-gray-800 text-base ml-3" 
              placeholder="Rechercher une épreuve..." 
              placeholderTextColor="#94a3b8" 
              value={searchQuery} 
              onChangeText={setSearchQuery} 
            />
            {searchQuery.length > 0 && (
              <TouchableOpacity onPress={() => setSearchQuery("")} className="bg-gray-100 rounded-full p-1">
                <Ionicons name="close" size={16} color="#64748b" />
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* Filtres stylisés */}
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          className="flex-row"
          contentContainerStyle={{ gap: 10 }}
        >
          {SUBJECTS.map((s) => {
            const isSelected = selectedSubject === s;
            const color = s !== "Toutes" ? SUBJECT_COLORS[s] : "#3b82f6";
            return (
              <TouchableOpacity 
                key={s} 
                onPress={() => setSelectedSubject(s)}
                className={`px-4 py-2 rounded-full ${isSelected ? 'bg-primary' : 'bg-white border border-gray-200'}`}
                style={isSelected ? {} : { borderWidth: 1 }}
              >
                <Text className={`text-sm font-medium ${isSelected ? 'text-white' : 'text-gray-600'}`}>
                  {s}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </LinearGradient>

      {/* Liste des épreuves */}
      <ScrollView 
        className="px-6 pt-4"
        contentContainerStyle={{ paddingBottom: 100 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#3b82f6" />}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View className="items-center py-20">
            <ActivityIndicator size="large" color="#3b82f6" />
            <Text className="text-gray-500 mt-3">Chargement des épreuves...</Text>
          </View>
        ) : filtered.length === 0 ? (
          <View className="items-center py-20">
            <View className="bg-gray-100 rounded-full p-6 mb-4">
              <Ionicons name="document-text-outline" size={48} color="#94a3b8" />
            </View>
            <Text className="text-gray-800 font-semibold text-lg mb-2">Aucune épreuve trouvée</Text>
            <Text className="text-gray-500 text-center px-8">
              {searchQuery ? `Aucun résultat pour "${searchQuery}"` : `Aucune épreuve de niveau ${user?.level} disponible`}
            </Text>
            {searchQuery && (
              <TouchableOpacity className="bg-primary px-6 py-3 rounded-full mt-6" onPress={() => setSearchQuery("")}>
                <Text className="text-white font-medium">Effacer la recherche</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : (
          <View style={{ gap: 12 }}>
            {filtered.map((exam, index) => (
              <TouchableOpacity 
                key={exam.id} 
                activeOpacity={0.8}
                onPress={() => router.push({ pathname: "/(main)/epreuves/[id]", params: { id: exam.id } })}
              >
                <View className="bg-white rounded-2xl p-4 shadow-sm" style={{
                  shadowColor: "#000",
                  shadowOffset: { width: 0, height: 2 },
                  shadowOpacity: 0.05,
                  shadowRadius: 6,
                  elevation: 2,
                }}>
                  <View className="flex-row items-start">
                    {/* Icone avec badge */}
                    <View className="relative">
                      <View 
                        className="w-14 h-14 rounded-2xl items-center justify-center mr-4"
                        style={{ backgroundColor: getSubjectColor(exam.subject) + "15" }}
                      >
                        <Ionicons name={getSubjectIcon(exam.subject)} size={26} color={getSubjectColor(exam.subject)} />
                      </View>
                      <View className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                    </View>

                    {/* Contenu */}
                    <View className="flex-1">
                      <View className="flex-row items-center justify-between mb-1">
                        <Text className="text-gray-500 text-xs font-medium uppercase tracking-wide">
                          {exam.subject}
                        </Text>
                        <View className="bg-gray-100 px-2 py-0.5 rounded-full">
                          <Text className="text-gray-600 text-xs">{exam.year}</Text>
                        </View>
                      </View>
                      
                      <Text className="text-gray-800 font-semibold text-base mb-2" numberOfLines={2}>
                        {exam.title}
                      </Text>
                      
                      <View className="flex-row items-center justify-between">
                        <View className="flex-row items-center">
                          <Ionicons name="school-outline" size={12} color="#94a3b8" />
                          <Text className="text-gray-400 text-xs ml-1">{exam.level}</Text>
                        </View>
                        <View className="flex-row items-center">
                          <Ionicons name="time-outline" size={12} color="#94a3b8" />
                          <Text className="text-gray-400 text-xs ml-1">{formatDate(exam.createdAt)}</Text>
                        </View>
                      </View>
                    </View>

                    {/* Flèche */}
                    <Ionicons name="chevron-forward" size={18} color="#cbd5e1" style={{ marginLeft: 8 }} />
                  </View>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}