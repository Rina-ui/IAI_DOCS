import React, { useEffect, useState, useCallback } from "react";
import { View, Text, ScrollView, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "expo-router";
import { examService, forumService } from "@/services/dataService";
import type { Exam, ForumPost, SubjectGroup } from "@/types";
import { Ionicons } from "@expo/vector-icons";
import { Animated, Easing } from "react-native";
import { LinearGradient } from "expo-linear-gradient";



import { WelcomeHeader } from "./components/WelcomeHeader";
import { SubjectList } from "./components/SubjectList";
import { RecentExamsList } from "./components/RecentExamsList";
import { ForumActivityList } from "./components/ForumActivityList";
import { Annoucement } from "./components/Annoucement";
import { levelToFiliere } from "@/utils/levelToFiliere";

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


  // Animation for AI Button using standard Animated API
  const pulseAnim = React.useRef(new Animated.Value(1)).current;
  const shimmerAnim = React.useRef(new Animated.Value(-1)).current;

  useEffect(() => {
    // Pulse animation
    const pulseSequence = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 1000,
          easing: Easing.bezier(0.4, 0, 0.6, 1),
          useNativeDriver: true,
        }),
      ])
    );

    // Shimmer animation
    const shimmerLoop = Animated.loop(
      Animated.timing(shimmerAnim, {
        toValue: 1,
        duration: 2500,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    pulseSequence.start();
    shimmerLoop.start();

    return () => {
      pulseSequence.stop();
      shimmerLoop.stop();
    };
  }, []);

  const animatedButtonStyle = {
    transform: [{ scale: pulseAnim }],
  };

  const translateX = shimmerAnim.interpolate({
    inputRange: [-1, 1],
    outputRange: [-100, 100],
  });

  const animatedShimmerStyle = {
    transform: [
      { translateX },
      { rotate: "30deg" }
    ],
  };



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

  const userFiliere = levelToFiliere(user?.level);

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
          <SubjectList filiere={userFiliere} />
          <Annoucement />
          <RecentExamsList recentExams={recentExams} />
          <ForumActivityList topPosts={topPosts} />
        </ScrollView>
      </SafeAreaView>

      {/* Floating AI Button */}
      <Animated.View
        style={[
          {
            zIndex: 50,
            shadowColor: "#EAB308",
            shadowOffset: { width: 0, height: 4 },
            shadowOpacity: 0.4,
            shadowRadius: 10,
            position: "absolute",
            bottom: 112, // match bottom-28 (28 * 4 = 112)
            right: 24,   // match right-6 (6 * 4 = 24)
          },
          animatedButtonStyle,
        ]}
      >
        <TouchableOpacity
          onPress={() => router.push("/(main)/ai/ai")}
          activeOpacity={0.8}
          className="w-14 h-14 bg-primary rounded-full items-center justify-center overflow-hidden elevation-8"
        >
          <Ionicons name="sparkles" size={28} color="white" />

          {/* Shimmer Effect */}
          <Animated.View
            style={[
              {
                position: "absolute",
                top: 0,
                bottom: 0,
                width: 40,
                opacity: 0.3,
              },
              animatedShimmerStyle
            ]}
          >
            <LinearGradient
              colors={["transparent", "rgba(255, 255, 255, 0.8)", "transparent"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={{ flex: 1 }}
            />
          </Animated.View>
        </TouchableOpacity>
      </Animated.View>

    </View>
  );
}
