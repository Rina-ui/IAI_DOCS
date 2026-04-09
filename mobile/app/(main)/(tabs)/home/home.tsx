import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { examService, forumService } from "@/services/dataService";
import type { Exam, ForumPost, SubjectGroup } from "@/types";
import { Ionicons } from "@expo/vector-icons";

import { WelcomeHeader } from "./components/WelcomeHeader";
import { SubjectList } from "./components/SubjectList";
import { RecentExamsList } from "./components/RecentExamsList";
import { ForumActivityList } from "./components/ForumActivityList";
import { Annoucement } from "./components/Annoucement";

export const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
  Mathematiques: "calculator",
  Physique: "nuclear",
  Chimie: "flask",
  Francais: "book",
  Histoire: "time",
  Philosophie: "school",
  Anglais: "globe",
  SVT: "leaf",
  Informatique: "code-slash",
};

export default function Home() {
  const { user } = useAuth();
  const router = useRouter();

  const [exams, setExams] = useState<Exam[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setApiError(null);
    try {
      const [examsData, postsData] = await Promise.allSettled([
        examService.getAll(user?.level),
        forumService.getAll(),
      ]);
      if (examsData.status === "fulfilled") setExams(examsData.value);
      if (postsData.status === "fulfilled") setForumPosts(postsData.value);
    } catch (error: any) {
      setApiError(error.message || "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  }, [user?.level]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchData();
    setRefreshing(false);
  }, [fetchData]);

  const subjectGroups: SubjectGroup[] = exams.reduce((acc, exam) => {
    const existing = acc.find((g) => g.subject === exam.subject);
    if (existing) { existing.exams.push(exam); existing.count += 1; }
    else { acc.push({ subject: exam.subject, exams: [exam], count: 1 }); }
    return acc;
  }, [] as SubjectGroup[]);

  const topPosts = [...forumPosts].sort((a, b) => b.upvotes - a.upvotes).slice(0, 3);
  const recentExams = [...exams].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()).slice(0, 4);

  const getSubjectIcon = (s: string) => SUBJECT_ICONS[s] || "document-text";

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#EAB308" />
      </View>
    );
  }

  return (
    <View className="flex-1 bg-neutral">
      <SafeAreaView className="flex-1" edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#EAB308" />}
        >
          <WelcomeHeader firstName={user?.firstName} examsCount={exams.length} level={user?.level} points={user?.points} />
          <SubjectList  />
          <Annoucement />
          <RecentExamsList recentExams={recentExams} />
          <ForumActivityList topPosts={topPosts} />
        </ScrollView>
      </SafeAreaView>

      {/* Floating AI Button */}
      <TouchableOpacity
        onPress={() => router.push("/(main)/ai/ai")}
        activeOpacity={0.8}
        className="absolute bottom-28 right-6 w-14 h-14 bg-primary rounded-full items-center justify-center shadow-lg elevation-5"
        style={{ zIndex: 50, shadowColor: "#0f172a", shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 6 }}
      >
        <Ionicons name="sparkles" size={28} className="text-white" />
      </TouchableOpacity>
    </View>
  );
}
