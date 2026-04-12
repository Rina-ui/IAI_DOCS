"use client";

import { useEffect, useState } from "react";
import {
  Users,
  FileText,
  Megaphone,
  TrendingUp,
  CheckSquare,
  MessageSquare,
} from "lucide-react";
import { getExams } from "@/lib/examService";
import { getAllAnnouncements } from "@/lib/announcementService";
import type { Exam, ForumPost } from "@/lib/types";

export default function AdminDashboard() {
  const [exams, setExams] = useState<Exam[]>([]);
  const [announcements, setAnnouncements] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examsData, announcementsData] = await Promise.all([
          getExams(),
          getAllAnnouncements(),
        ]);
        setExams(examsData);
        setAnnouncements(announcementsData);
      } catch (error) {
        console.error("Failed to fetch admin data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
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
      label: "Annonces",
      value: announcements.length.toString(),
      icon: Megaphone,
      color: "text-tertiary",
    },
    {
      label: "Matières",
      value: [...new Set(exams.map((e) => e.subject))].length.toString(),
      icon: TrendingUp,
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
          Tableau de bord Administrateur
        </h1>
        <p className="text-secondary">
          Gérez l'ensemble du système : utilisateurs, examens, annonces et paramètres.
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

      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Users size={18} className="text-primary" />
            Gestion Utilisateurs
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/teachers"
              className="block p-4 bg-neutral rounded-xl hover:bg-neutral/80 transition-colors"
            >
              <p className="font-bold text-on-surface">Gérer les enseignants</p>
              <p className="text-sm text-secondary">Créer et gérer les comptes</p>
            </a>
          </div>
        </div>

        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <FileText size={18} className="text-primary" />
            Gestion Examens
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/exams"
              className="block p-4 bg-neutral rounded-xl hover:bg-neutral/80 transition-colors"
            >
              <p className="font-bold text-on-surface">Voir tous les examens</p>
              <p className="text-sm text-secondary">{exams.length} examens</p>
            </a>
            <a
              href="/admin/validations"
              className="block p-4 bg-neutral rounded-xl hover:bg-neutral/80 transition-colors"
            >
              <p className="font-bold text-on-surface">Validations</p>
              <p className="text-sm text-secondary">
                {exams.filter((e) => e.status === "pending").length} en attente
              </p>
            </a>
          </div>
        </div>

        <div className="bg-surface border border-secondary/20 rounded-2xl p-6">
          <h2 className="text-lg font-bold text-on-surface mb-4 flex items-center gap-2">
            <Megaphone size={18} className="text-primary" />
            Annonces
          </h2>
          <div className="space-y-3">
            <a
              href="/admin/announcements"
              className="block p-4 bg-neutral rounded-xl hover:bg-neutral/80 transition-colors"
            >
              <p className="font-bold text-on-surface">Gérer les annonces</p>
              <p className="text-sm text-secondary">
                {announcements.length} annonces
              </p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
