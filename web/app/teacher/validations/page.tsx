"use client";

import { useEffect, useState } from "react";
import { getExams, validateExam } from "@/lib/examService";
import type { Exam } from "@/lib/types";
import { CheckCircle, XCircle, FileText } from "lucide-react";

export default function ValidationsPage() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);
  const [validating, setValidating] = useState<string | null>(null);

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const data = await getExams();
        setExams(data);
      } catch (error) {
        console.error("Failed to fetch exams:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchExams();
  }, []);

  const handleValidate = async (id: string) => {
    try {
      setValidating(id);
      await validateExam(id);
      setExams((prev) =>
        prev.map((exam) =>
          exam.id === id ? { ...exam, status: "validated" } : exam
        )
      );
    } catch (error) {
      console.error("Failed to validate exam:", error);
    } finally {
      setValidating(null);
    }
  };

  const pendingExams = exams.filter((e) => e.status === "pending");

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          Validations d'examens
        </h1>
        <p className="text-secondary">
          Examinez et validez les examens soumis par les enseignants.
        </p>
      </header>

      {pendingExams.length === 0 ? (
        <div className="bg-surface border border-secondary/20 rounded-2xl p-12 text-center">
          <CheckCircle size={48} className="text-tertiary mx-auto mb-4" />
          <h3 className="text-xl font-bold text-on-surface mb-2">
            Aucun examen en attente
          </h3>
          <p className="text-secondary">Tous les examens ont été traités.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {pendingExams.map((exam) => (
            <div
              key={exam.id}
              className="bg-surface border border-secondary/20 rounded-2xl p-6 flex items-start justify-between"
            >
              <div className="flex items-start gap-4 flex-1">
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center shrink-0">
                  <FileText size={24} className="text-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-on-surface mb-2">
                    {exam.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-secondary">
                    <span className="bg-neutral px-3 py-1 rounded-lg">
                      {exam.subject}
                    </span>
                    <span className="bg-neutral px-3 py-1 rounded-lg">
                      {exam.level}
                    </span>
                    <span className="bg-neutral px-3 py-1 rounded-lg">
                      {exam.year}
                    </span>
                    <span className="bg-neutral px-3 py-1 rounded-lg">
                      {exam.questions.length} questions
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex gap-2 ml-4">
                <button
                  onClick={() => handleValidate(exam.id)}
                  disabled={validating === exam.id}
                  className="bg-tertiary text-white px-4 py-2 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 disabled:opacity-50 transition-opacity"
                >
                  <CheckCircle size={18} />
                  {validating === exam.id ? "..." : "Valider"}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
