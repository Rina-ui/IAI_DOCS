"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { getExam } from "@/services/examService";
import { startTraining, submitTraining } from "@/services/trainingService";
import type { Exam, ExamQuestion, TrainingAnswer } from "@/services/types";
import { ArrowLeft, Send, CheckCircle, AlertCircle } from "lucide-react";

export default function TrainingSessionPage() {
  const params = useParams();
  const router = useRouter();
  const examId = params.id as string;

  const [exam, setExam] = useState<Exam | null>(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [error, setError] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const data = await getExam(examId);
        setExam(data);
        setError(null);
      } catch (err) {
        setError("Impossible de charger l'examen.");
        console.error("Failed to fetch exam:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchExam();
  }, [examId]);

  const handleStartTraining = async () => {
    try {
      const session = await startTraining({ examId });
      setSessionId(session.id);
    } catch (err) {
      setError("Impossible de démarrer la session d'entraînement.");
      console.error("Failed to start training:", err);
    }
  };

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    if (!sessionId) return;

    try {
      setSubmitting(true);
      const formattedAnswers: TrainingAnswer[] = Object.entries(answers).map(
        ([questionId, answer]) => ({
          questionId,
          answer,
        })
      );

      const correction = await submitTraining(sessionId, {
        answers: formattedAnswers,
      });

      // Navigate to correction page
      router.push(`/student/training/${examId}/correction?sessionId=${sessionId}`);
    } catch (err) {
      setError("Impossible de soumettre vos réponses.");
      console.error("Failed to submit training:", err);
    } finally {
      setSubmitting(false);
    }
  };

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

  if (error || !exam) {
    return (
      <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
        <p className="font-bold">{error || "Examen non trouvé"}</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <a
          href="/student/training"
          className="inline-flex items-center gap-2 text-secondary hover:text-on-surface mb-4 transition-colors"
        >
          <ArrowLeft size={16} />
          Retour aux entraînements
        </a>
        <h1 className="text-3xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          {exam.title}
        </h1>
        <div className="flex flex-wrap gap-2 text-sm">
          <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
            {exam.subject}
          </span>
          <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
            {exam.level}
          </span>
          <span className="bg-neutral px-3 py-1 rounded-lg font-medium text-secondary">
            {exam.year}
          </span>
        </div>
      </header>

      {!sessionId ? (
        <div className="bg-surface border border-secondary/20 rounded-2xl p-12 text-center">
          <CheckCircle size={48} className="text-primary mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-on-surface mb-3">
            Prêt à commencer ?
          </h2>
          <p className="text-secondary mb-6">
            Cet examen contient {exam.questions.length} questions. Répondez-y et obtenez une
            correction générée par IA.
          </p>
          <button
            onClick={handleStartTraining}
            className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all"
          >
            Démarrer la session
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Questions */}
          <div className="space-y-6">
            {exam.questions.map((question, index) => (
              <QuestionCard
                key={question.id}
                question={question}
                index={index + 1}
                answer={answers[question.id] || ""}
                onAnswerChange={(value) => handleAnswerChange(question.id, value)}
              />
            ))}
          </div>

          {/* Submit Button */}
          <div className="bg-surface border border-secondary/20 rounded-2xl p-6 flex items-center justify-between">
            <div className="text-sm text-secondary">
              <AlertCircle size={16} className="inline mr-2" />
              {Object.keys(answers).length}/{exam.questions.length} questions répondues
            </div>
            <button
              onClick={handleSubmit}
              disabled={submitting || Object.keys(answers).length === 0}
              className="bg-primary text-on-primary px-8 py-3.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
            >
              <Send size={18} />
              {submitting ? "Soumission..." : "Soumettre et voir la correction"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function QuestionCard({
  question,
  index,
  answer,
  onAnswerChange,
}: {
  question: ExamQuestion;
  index: number;
  answer: string;
  onAnswerChange: (value: string) => void;
}) {
  return (
    <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
      <div className="flex items-start gap-4 mb-4">
        <span className="bg-primary/10 text-primary w-8 h-8 rounded-lg flex items-center justify-center font-bold shrink-0">
          {index}
        </span>
        <div>
          <h3 className="text-lg font-bold text-on-surface mb-2">{question.content}</h3>
          {question.type === "multiple_choice" && question.options && (
            <p className="text-sm text-secondary">Choisissez la bonne réponse</p>
          )}
          {question.type === "true_false" && (
            <p className="text-sm text-secondary">Vrai ou Faux ?</p>
          )}
          {question.type === "open_ended" && (
            <p className="text-sm text-secondary">Répondez en quelques phrases</p>
          )}
        </div>
      </div>

      {question.type === "multiple_choice" && question.options ? (
        <div className="space-y-2 ml-12">
          {question.options.map((option, i) => (
            <label
              key={i}
              className="flex items-center gap-3 p-3 rounded-xl bg-neutral hover:bg-neutral/80 cursor-pointer transition-colors"
            >
              <input
                type="radio"
                name={`question-${question.id}`}
                value={option}
                checked={answer === option}
                onChange={(e) => onAnswerChange(e.target.value)}
                className="w-4 h-4 text-primary"
              />
              <span className="text-on-surface">{option}</span>
            </label>
          ))}
        </div>
      ) : question.type === "true_false" ? (
        <div className="flex gap-3 ml-12">
          {["Vrai", "Faux"].map((option) => (
            <button
              key={option}
              onClick={() => onAnswerChange(option)}
              className={`flex-1 py-3 rounded-xl font-bold transition-colors ${answer === option
                  ? "bg-primary text-on-primary"
                  : "bg-neutral text-secondary hover:bg-neutral/80"
                }`}
            >
              {option}
            </button>
          ))}
        </div>
      ) : (
        <textarea
          value={answer}
          onChange={(e) => onAnswerChange(e.target.value)}
          placeholder="Votre réponse..."
          rows={5}
          className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50 resize-none ml-12"
        />
      )}
    </div>
  );
}
