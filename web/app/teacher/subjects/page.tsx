"use client";

import { useEffect, useState } from "react";
import { getSubjects } from "@/lib/subjectService";
import type { Subject } from "@/lib/subjectService";
import { BookOpen } from "lucide-react";

const filieres = ["TC1", "TC2", "GLSI", "ASR", "COMMUN"];

export default function SubjectsPage() {
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedFiliere, setSelectedFiliere] = useState<string>("");

  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        const data = await getSubjects(selectedFiliere || undefined);
        setSubjects(data);
      } catch (error) {
        console.error("Failed to fetch subjects:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSubjects();
  }, [selectedFiliere]);

  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="h-12 w-64 bg-neutral rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
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
          Matières
        </h1>
        <p className="text-secondary">
          Parcourez les matières disponibles par filière.
        </p>
      </header>

      <div className="flex gap-2 overflow-x-auto pb-2">
        <button
          onClick={() => setSelectedFiliere("")}
          className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${
            selectedFiliere === ""
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
          }`}
        >
          Toutes les filières
        </button>
        {filieres.map((filiere) => (
          <button
            key={filiere}
            onClick={() => setSelectedFiliere(filiere)}
            className={`px-5 py-2.5 rounded-xl text-sm font-bold whitespace-nowrap ${
              selectedFiliere === filiere
                ? "bg-primary text-on-primary shadow-sm"
                : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
            }`}
          >
            {filiere}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {subjects.map((subject) => (
          <div
            key={subject.id}
            className="bg-surface border border-secondary/20 rounded-2xl p-6 hover:border-primary/40 hover:shadow-lg transition-all"
          >
            <div className="flex items-start gap-3 mb-3">
              <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                <BookOpen size={20} className="text-primary" />
              </div>
              <div>
                <h3 className="font-bold text-on-surface">{subject.name}</h3>
                <p className="text-xs text-secondary">{subject.code}</p>
              </div>
            </div>
            {subject.description && (
              <p className="text-sm text-secondary mb-3">{subject.description}</p>
            )}
            <div className="flex items-center justify-between">
              <span className="text-xs bg-neutral px-3 py-1 rounded-lg font-medium">
                {subject.filiere}
              </span>
              {subject.examCount !== undefined && (
                <span className="text-xs text-secondary">
                  {subject.examCount} examen{subject.examCount !== 1 ? "s" : ""}
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
