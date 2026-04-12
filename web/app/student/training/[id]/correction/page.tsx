"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams } from "next/navigation";
import { getCorrection } from "@/lib/trainingService";
import type { TrainingCorrection, QuestionCorrection } from "@/lib/types";
import { ArrowLeft, CheckCircle, XCircle, Award, TrendingUp } from "lucide-react";

export default function CorrectionPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("sessionId") as string;
  const examId = params.id as string;

  const [correction, setCorrection] = useState<TrainingCorrection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCorrection = async () => {
      if (!sessionId) {
        setError("Session ID manquant");
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        const data = await getCorrection(sessionId);
        setCorrection(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger la correction.");
        console.error("Failed to fetch correction:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCorrection();
  }, [sessionId]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="h-40 bg-neutral rounded-2xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-48 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  if (error || !correction) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">{error || "Correction non trouvée"}</p>
      </div>
    );
  }

  const scorePercentage = Math.round((correction.score / correction.totalPoints) * 100);

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
          Correction IA
        </h1>
      </header>

      {/* Score Overview */}
      <div className="bg-gradient-to-r from-primary/10 to-tertiary/10 border border-primary/20 rounded-2xl p-8">
        <div className="flex flex-col md:flex-row items-center gap-8">
          <div className="text-center">
            <div className="relative w-40 h-40">
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="currentColor"
                  strokeWidth="12"
                  fill="none"
                  className="text-secondary/20"
                />
                <circle
                  cx="80"
                  cy="80"
                  r="70"
                  stroke="url(#gradient)"
                  strokeWidth="12"
                  fill="none"
                  strokeDasharray={`${2 * Math.PI * 70}`}
                  strokeDashoffset={`${2 * Math.PI * 70 * (1 - scorePercentage / 100)}`}
                  strokeLinecap="round"
                />
                <defs>
                  <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor="var(--color-primary)" />
                    <stop offset="100%" stopColor="var(--color-tertiary)" />
                  </linearGradient>
                </defs>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-4xl font-black text-on-surface">{scorePercentage}%</span>
                <span className="text-xs text-secondary font-medium">Score</span>
              </div>
            </div>
          </div>

          <div className="flex-1 grid grid-cols-2 gap-4">
            <div className="bg-surface/50 rounded-xl p-4">
              <Award size={24} className="text-primary mb-2" />
              <p className="text-2xl font-bold text-on-surface">{correction.score}</p>
              <p className="text-xs text-secondary">Points obtenus</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-4">
              <TrendingUp size={24} className="text-tertiary mb-2" />
              <p className="text-2xl font-bold text-on-surface">{correction.totalPoints}</p>
              <p className="text-xs text-secondary">Points totaux</p>
            </div>
            <div className="bg-surface/50 rounded-xl p-4 col-span-2">
              <CheckCircle size={24} className="text-primary mb-2" />
              <p className="text-sm text-on-surface">{correction.feedback}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Question Corrections */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-on-surface">Détail des réponses</h2>
        {correction.questionCorrections.map((qc, index) => (
          <QuestionCorrectionCard key={qc.questionId} correction={qc} index={index + 1} />
        ))}
      </div>
    </div>
  );
}

function QuestionCorrectionCard({
  correction,
  index,
}: {
  correction: QuestionCorrection;
  index: number;
}) {
  return (
    <div
      className={`bg-surface border rounded-2xl p-6 ${correction.isCorrect
        ? "border-tertiary/20"
        : "border-error/20"
        }`}
    >
      <div className="flex items-start gap-4 mb-4">
        <div
          className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${correction.isCorrect
            ? "bg-tertiary/10 text-tertiary"
            : "bg-error/10 text-error"
            }`}
        >
          {correction.isCorrect ? <CheckCircle size={18} /> : <XCircle size={18} />}
        </div>
        <div className="flex-1">
          <div className="flex items-center justify-between mb-2">
            <h3 className="font-bold text-on-surface">Question {index}</h3>
            <span className="text-sm font-bold text-secondary">
              {correction.points}/{correction.maxPoints} pts
            </span>
          </div>

          <div className="space-y-3 ml-12">
            <div>
              <p className="text-xs font-bold text-secondary mb-1">Votre réponse</p>
              <div
                className={`p-3 rounded-xl text-sm ${correction.isCorrect
                  ? "bg-tertiary/10 text-tertiary"
                  : "bg-error/10 text-error"
                  }`}
              >
                {Array.isArray(correction.studentAnswer)
                  ? correction.studentAnswer.join(", ")
                  : correction.studentAnswer}
              </div>
            </div>

            {!correction.isCorrect && (
              <div>
                <p className="text-xs font-bold text-secondary mb-1">Réponse correcte</p>
                <div className="p-3 rounded-xl text-sm bg-tertiary/10 text-tertiary">
                  {Array.isArray(correction.correctAnswer)
                    ? correction.correctAnswer.join(", ")
                    : correction.correctAnswer}
                </div>
              </div>
            )}

            {correction.feedback && (
              <div>
                <p className="text-xs font-bold text-secondary mb-1">Commentaire IA</p>
                <p className="text-sm text-on-surface bg-neutral p-3 rounded-xl">
                  {correction.feedback}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
