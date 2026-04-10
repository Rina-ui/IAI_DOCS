import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Image, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";
import { api } from "@/services/api";

interface SubjectFromAPI {
  id: string;
  name: string;
  filiere: string;
  description?: string;
}

interface SubjectListProps {
  /** Filter subjects by this filiere. If not provided, fetches all subjects. */
  filiere?: string;
}

export function SubjectList({ filiere }: SubjectListProps) {
  const router = useRouter();
  const [subjects, setSubjects] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const url = filiere ? `/subjects?filiere=${filiere}` : "/subjects";
        const response = await api.get(url);
        const data = response.data;

        // When filiere filter is applied, backend returns { filiere: [...], subjects: [...] }
        // When no filter, backend returns { TC1: [...], TC2: [...], GLSI: [...], ASR: [...] }
        let allSubjects: SubjectFromAPI[] = [];

        if (filiere && data.subjects && Array.isArray(data.subjects)) {
          // Filtered response
          allSubjects = data.subjects;
        } else {
          // Unfiltered response - extract from all filieres
          Object.values(data).forEach((filiereData: any) => {
            if (Array.isArray(filiereData)) {
              allSubjects.push(...filiereData);
            }
          });
        }

        const uniqueNames = [...new Set(allSubjects.map(s => s.name))];
        setSubjects(uniqueNames);
        setError(null);
      } catch (err) {
        console.error("[SubjectList] Failed to fetch subjects:", err);
        setError("Erreur de chargement");
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [filiere]);

  const handleSubjectPress = (subject: string) => {
    router.push({
      pathname: "/(main)/(tabs)/epreuves/epreuves",
      params: { subject }
    });
  };

  if (loading) {
    return (
      <View className="mt-3 px-6 py-4">
        <ActivityIndicator size="small" color="#EAB308" />
      </View>
    );
  }

  if (error) {
    return (
      <View className="mt-3 px-6 py-2">
        <Text className="text-red-500 text-xs">{error}</Text>
      </View>
    );
  }

  if (subjects.length === 0) {
    return null;
  }

  return (
    <View className="mt-3">
      {/* Circles Row */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 24, gap: 16 }}
      >
        {subjects.map((subject, index) => (
          <TouchableOpacity
            key={`${subject}-${index}`}
            onPress={() => handleSubjectPress(subject)}
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
              {subject.length > 12 ? subject.substring(0, 12) + "…" : subject}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
}