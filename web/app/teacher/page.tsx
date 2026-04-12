"use client";

import { useEffect, useState } from "react";
import { FileText, CheckSquare, TrendingUp, Users } from "lucide-react";
import { getExams } from "@/lib/examService";
import type { Exam } from "@/lib/types";

export default function TeacherDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [loading, setLoading] = useState(true);

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

  const stats = [
    {
      label: "Total Examens",
      value: exams.length.toString(),
      icon: FileText,
      color: "text-primary",
    },
    {
      label: "En Attente",
      value: exams.filter((e) => e.status === "pending").toString(),
      icon: CheckSquare,
      color: "text-amber-500",
    },
    {
      label: "Validés",
      value: exams.filter((e) => e.status === "validated").toString(),
      icon: TrendingUp,
      color: "text-tertiary",
    },
    {
      label: "Matières",
      value: [...new Set(exams.map((e) => e.subject))].length.toString(),
      icon: Users,
      color: "text-secondary",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-24 bg-neutral rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          Tableau de bord Enseignant
        </h1>
        <p className="text-secondary">
          Gérez vos examens, validez les soumissions et suivez les performances.
        </p>
      </header>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-surface p-5 rounded-2xl border border-secondary/20 flex items-center gap-4"
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

      <div className="grid md:grid-cols-2 gap-8">
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4">Actions rapides</h2>
          <div className="space-y-3">
            <a
              href="/teacher/exams/upload"
              className="block p-4 bg-neutral rounded-xl hover:bg-neutral/80 transition-colors"
            >
              <p className="font-bold text-on-surface">Télécharger un examen</p>
              <p className="text-sm text-secondary">Ajouter un nouveau PDF</p>
            </a>
            <a
              href="/teacher/validations"
              className="block p-4 bg-neutral rounded-xl hover:bg-neutral/80 transition-colors"
            >
              <p className="font-bold text-on-surface">Valider des examens</p>
              <p className="text-sm text-secondary">
                {exams.filter((e) => e.status === "pending").length} en attente
              </p>
            </a>
          </div>
        </div>

        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4">Examens récents</h2>
          <div className="space-y-3">
            {exams.slice(0, 5).map((exam) => (
              <div key={exam.id} className="flex items-center justify-between p-3 bg-neutral rounded-xl">
                <div>
                  <p className="font-semibold text-on-surface">{exam.title}</p>
                  <p className="text-xs text-secondary">{exam.subject} • {exam.year}</p>
                </div>
                <span
                  className={`text-xs font-bold px-2 py-1 rounded-lg ${
                    exam.status === "validated"
                      ? "bg-tertiary/10 text-tertiary"
                      : "bg-amber-100 text-amber-900"
                  }`}
                >
                  {exam.status === "validated" ? "Validé" : "En attente"}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
