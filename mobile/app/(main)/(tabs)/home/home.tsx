import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { examService, forumService } from "@/services/dataService";
import type { Exam, ForumPost, SubjectGroup } from "@/types";
import { Ionicons } from "@expo/vector-icons";

import { WelcomeHeader } from "./components/WelcomeHeader";
import { ApiErrorBanner } from "./components/ApiErrorBanner";
import { WelcomeEmptyState } from "./components/WelcomeEmptyState";
import { SubjectList } from "./components/SubjectList";
import { RecentExamsList } from "./components/RecentExamsList";
import { ForumActivityList } from "./components/ForumActivityList";

const SUBJECT_COLORS: Record<string, string> = {
  Mathematiques: "#1e3a8a",
  Physique: "#7c3aed",
  Chimie: "#059669",
  Francais: "#dc2626",
  Histoire: "#d97706",
  Philosophie: "#4f46e5",
  Anglais: "#0891b2",
  SVT: "#16a34a",
  Informatique: "#2563eb",
};

const SUBJECT_ICONS: Record<string, keyof typeof Ionicons.glyphMap> = {
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
  const hasAnyData = exams.length > 0 || forumPosts.length > 0;

  const getSubjectColor = (s: string) => SUBJECT_COLORS[s] || "#6d7698";
  const getSubjectIcon = (s: string) => SUBJECT_ICONS[s] || "document-text";

  const formatRelativeDate = (dateStr: string) => {
    const d = Math.floor((Date.now() - new Date(dateStr).getTime()) / 86400000);
    if (d === 0) return "Aujourd'hui";
    if (d === 1) return "Hier";
    if (d < 7) return `Il y a ${d}j`;
    return new Date(dateStr).toLocaleDateString("fr-FR");
  };

  if (loading) {
    return (
      <View className="flex-1 bg-surface items-center justify-center">
        <ActivityIndicator size="large" color="#1e3a8a" />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-neutral" edges={["top"]}>
      <ScrollView contentContainerStyle={{ paddingBottom: 24 }} refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1e3a8a" />}>
        <WelcomeHeader firstName={user?.firstName} examsCount={exams.length} level={user?.level} points={user?.points} />
        {apiError && <ApiErrorBanner onRetry={onRefresh} />}
        <SubjectList subjectGroups={subjectGroups} getSubjectColor={getSubjectColor} getSubjectIcon={getSubjectIcon as any} />
        <RecentExamsList recentExams={recentExams} getSubjectColor={getSubjectColor} getSubjectIcon={getSubjectIcon as any} formatRelativeDate={formatRelativeDate} />
        <ForumActivityList topPosts={topPosts} />
      </ScrollView>
    </SafeAreaView>
  );
}
