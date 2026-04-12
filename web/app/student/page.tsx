"use client";

import { useEffect, useState } from "react";
import { BookOpen, FileText, MessageSquare, TrendingUp, Award, Clock } from "lucide-react";
import { getExams } from "@\/lib\/examService";
import { getForumPosts } from "@\/lib\/forumService";
import type { Exam, ForumPost } from "@\/lib\/types";

export default function StudentDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [examsData, postsData] = await Promise.all([
          getExams(),
          getForumPosts(),
        ]);
        setExams(examsData);
        setForumPosts(postsData);
        setError(null);
      } catch (err) {
        setError("Impossible de charger les données. Veuillez réessayer.");
        console.error("Failed to fetch dashboard data:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const stats = [
    {
      label: "Examens disponibles",
      value: exams.length.toString(),
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "Sujets de forum",
      value: forumPosts.length.toString(),
      icon: MessageSquare,
      color: "text-tertiary",
    },
    {
      label: "Total de votes",
      value: forumPosts.reduce((sum, post) => sum + post.votes, 0).toString(),
      icon: TrendingUp,
      color: "text-primary",
    },
    {
      label: "Matières",
      value: [...new Set(exams.map((e) => e.subject))].length.toString(),
      icon: BookOpen,
      color: "text-secondary",
    },
  ];

  const recentExams = exams.slice(0, 5);
  const topPosts = [...forumPosts].sort((a, b) => b.votes - a.votes).slice(0, 3);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral rounded-2xl" />
          ))}
        </div>
        <div className="grid md:grid-cols-2 gap-8">
          <div className="h-80 bg-neutral rounded-2xl" />
          <div className="h-80 bg-neutral rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">{error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          Tableau de bord
        </h1>
        <p className="text-secondary max-w-lg flex items-center gap-2">
          <Award size={16} className="text-primary shrink-0" />
          Bienvenue sur votre espace d'apprentissage intelligent.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface p-5 rounded-2xl border border-secondary/20 flex items-center gap-4 hover:border-primary/30 transition-colors"
          >
            <div className="w-10 h-10 rounded-xl bg-neutral flex items-center justify-center shrink-0">
              <stat.icon size={20} className={stat.color} />
            </div>
            <div>
              <p className="text-2xl font-bold text-on-surface">{stat.value}</p>
              <p className="text-xs text-secondary font-medium">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid md:grid-cols-2 gap-8">
        {/* Recent Exams */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Clock size={18} className="text-primary" />
            Examens récents
          </h2>
          {recentExams.length === 0 ? (
            <p className="text-secondary text-sm">Aucun examen disponible pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {recentExams.map((exam) => (
                <div
                  key={exam.id}
                  className="flex items-center justify-between p-3 rounded-xl bg-neutral hover:bg-neutral/80 transition-colors cursor-pointer"
                >
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface truncate">{exam.title}</p>
                    <p className="text-xs text-secondary">
                      {exam.subject} • {exam.year}
                    </p>
                  </div>
                  <span
                    className={`text-xs font-bold px-2 py-1 rounded-lg ${exam.status === "validated"
                      ? "bg-tertiary/10 text-tertiary"
                      : "bg-secondary/10 text-secondary"
                      }`}
                  >
                    {exam.status === "validated" ? "Validé" : "En attente"}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Forum Posts */}
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <TrendingUp size={18} className="text-primary" />
            Sujets populaires
          </h2>
          {topPosts.length === 0 ? (
            <p className="text-secondary text-sm">Aucun sujet de forum pour le moment.</p>
          ) : (
            <div className="space-y-3">
              {topPosts.map((post) => (
                <div
                  key={post.id}
                  className="flex items-start gap-3 p-3 rounded-xl bg-neutral hover:bg-neutral/80 transition-colors cursor-pointer"
                >
                  <div className="flex flex-col items-center min-w-[50px]">
                    <span className="text-lg font-bold text-on-surface">{post.votes}</span>
                    <span className="text-[9px] uppercase tracking-widest text-secondary font-bold">
                      votes
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-on-surface line-clamp-2 mb-1">
                      {post.title}
                    </p>
                    <p className="text-xs text-secondary">
                      {post.answersCount} réponses • {post.views} vues
                    </p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-primary/10 to-tertiary/10 border border-primary/20 rounded-2xl p-8">
        <h2 className="text-2xl font-bold text-on-surface mb-4">Commencer maintenant</h2>
        <div className="grid sm:grid-cols-3 gap-4">
          <a
            href="/student/exams"
            className="bg-surface border border-secondary/20 rounded-xl p-5 hover:border-primary/40 hover:shadow-lg transition-all group"
          >
            <FileText size={24} className="text-primary mb-3" />
            <p className="font-bold text-on-surface mb-1">Parcourir les examens</p>
            <p className="text-xs text-secondary">Accédez à tous les examens disponibles</p>
          </a>
          <a
            href="/student/training"
            className="bg-surface border border-secondary/20 rounded-xl p-5 hover:border-tertiary/40 hover:shadow-lg transition-all group"
          >
            <BookOpen size={24} className="text-tertiary mb-3" />
            <p className="font-bold text-on-surface mb-1">Démarrer un entraînement</p>
            <p className="text-xs text-secondary">Pratiquez avec correction IA</p>
          </a>
          <a
            href="/student/forum"
            className="bg-surface border border-secondary/20 rounded-xl p-5 hover:border-primary/40 hover:shadow-lg transition-all group"
          >
            <MessageSquare size={24} className="text-primary mb-3" />
            <p className="font-bold text-on-surface mb-1">Rejoindre le forum</p>
            <p className="text-xs text-secondary">Discutez avec la communauté</p>
          </a>
        </div>
      </div>
    </div>
  );
}
