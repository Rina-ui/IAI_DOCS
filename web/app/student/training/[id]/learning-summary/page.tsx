"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getLearningSummary } from "@/lib/trainingService";
import type { LearningSummary } from "@/lib/trainingService";
import { ArrowLeft, TrendingUp, Award, CheckCircle, AlertCircle, Lightbulb, BookOpen } from "lucide-react";

export default function LearningSummaryPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as string;
  const examId = params.id as string;

  const [summary, setSummary] = useState<LearningSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchSummary = async () => {
      if (!sessionId) {
        setError("Session ID manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        console.log("📊 Fetching learning summary for session:", sessionId);
        const data = await getLearningSummary(sessionId);
        setSummary(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger le résumé d'apprentissage.");
        console.error("Failed to fetch learning summary:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchSummary();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="h-40 bg-neutral rounded-2xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !summary) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">{error || "Résumé non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <a
          href="/student/exams"
          className="inline-flex items-center gap-2 text-secondary hover:text-on-surface mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux examens
        </a>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          Résumé d'apprentissage
        </h1>
        <p className="text-secondary flex items-center gap-2">
          <BookOpen size={16} /> Mode Apprentissage - Session terminée
        </p>
      </header>

      {/* Score Overview */}
      <div className="bg-gradient-to-r from-tertiary/10 to-primary/10 border border-tertiary/20 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-6">
          <div className="text-center">
            <div className="relative w-32 h-32">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="currentColor"
                  strokeWidth="10"
                  fill="none"
                  className="text-secondary/20"
                />
                <circle
                  cx="64"
                  cy="64"
                  r="56"
                  stroke="url(#gradient)"
                  strokeWidth="10"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 56}`}
                  strokeDashoffset={`${2 * Math.PI * 56 * (1 - summary.overallScore / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-tertiary)" />
                    <stop offset="100%" stopColor="var(--color-primary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-3xl font-black text-on-surface">{summary.overallScore}%</span>
                <span className="text-xs text-secondary font-medium">Score</span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-surface/50 rounded-xl p-4">
              <Award size={24} className="text-tertiary mb-2" />
              <p className="text-sm text-secondary">Session ID</p>
              <p className="text-xs text-on-surface font-mono truncate">{summary.sessionId}</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-4">
              <TrendingUp size={24} className="text-primary mb-2" />
              <p className="text-sm text-secondary">Terminé le</p>
              <p className="text-sm text-on-surface font-semibold">
                {new Date(summary.aiGeneratedAt).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Strengths */}
      {summary.strengths.length > 0 && (
        <div className="bg-surface border border-success/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-success/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <CheckCircle size={24} className="text-success" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Points forts</h2>
          </div>
          <ul className="space-y-2">
            {summary.strengths.map((strength, index) => (
              <li key={index} className="flex items-start gap-2 text-secondary">
                <CheckCircle size={16} className="text-success shrink-0 mt-1" />
                <span>{strength}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Weaknesses */}
      {summary.weaknesses.length > 0 && (
        <div className="bg-surface border border-error/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-error/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <AlertCircle size={24} className="text-error" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Points à améliorer</h2>
          </div>
          <ul className="space-y-2">
            {summary.weaknesses.map((weakness, index) => (
              <li key={index} className="flex items-start gap-2 text-secondary">
                <AlertCircle size={16} className="text-error shrink-0 mt-1" />
                <span>{weakness}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Recommendations */}
      {summary.recommendations.length > 0 && (
        <div className="bg-surface border border-tertiary/20 rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-tertiary/10 w-12 h-12 rounded-xl flex items-center justify-center">
              <Lightbulb size={24} className="text-tertiary" />
            </div>
            <h2 className="text-xl font-bold text-on-surface">Recommandations IA</h2>
          </div>
          <ul className="space-y-3">
            {summary.recommendations.map((rec, index) => (
              <li key={index} className="bg-tertiary/5 rounded-xl p-4 text-secondary border border-tertiary/10">
                <span className="font-semibold text-tertiary mr-2">{index + 1}.</span>
                {rec}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex gap-4">
        <a
          href={`/student/training/${examId}`}
          className="flex-1 bg-neutral text-secondary px-6 py-4 rounded-xl font-bold text-center hover:bg-neutral/80 transition-all"
        >
          Recommencer
        </a>
        <a
          href="/student/exams"
          className="flex-1 bg-tertiary text-on-primary px-6 py-4 rounded-xl font-bold text-center hover:opacity-90 transition-all shadow-lg shadow-tertiary/20"
        >
          Choisir un autre examen
        </a>
      </div>
    </div>
  );
}
