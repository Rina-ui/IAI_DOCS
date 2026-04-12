"use client";

import { FileText, Filter, Search, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { getExams } from "@\/lib\/examService";
import type { Exam } from "@\/lib\/types";

export default function ExamsPage() {
  const [examsData, setExamsData] = useState<Exam[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedLevel, setSelectedLevel] = useState<string>("");

  useEffect(() => {
    async function loadExams() {
      try {
        setIsLoading(true);
        setError(null);
        const data = await getExams({
          level: selectedLevel || undefined,
          subject: searchQuery || undefined,
        });
        setExamsData(data);
      } catch (err) {
        console.error(err);
        setError(err instanceof Error ? err.message : "Erreur de chargement");
      } finally {
        setIsLoading(false);
      }
    }
    loadExams();
  }, [selectedLevel, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto space-y-10">
      {/* Header Section */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
            Bibliothèque d&apos;examens
          </h1>
          <p className="text-secondary max-w-md">
            Accédez au référentiel de vos examens précédents, ensembles
            d&apos;entraînement et analyses détaillées.
          </p>
        </div>

        {/* Analytics Summary Widget */}
        <div className="bg-surface p-6 rounded-2xl shadow-sm flex items-center gap-8 border border-secondary/20">
          <div className="flex flex-col">
            <span className="text-xs font-bold text-secondary/60 uppercase tracking-tighter">
              Terminés
            </span>
            <span className="text-2xl font-bold text-primary">
              14{" "}
              <span className="text-sm font-normal text-secondary/80">
                / 20
              </span>
            </span>
          </div>
          <div className="h-10 w-px bg-secondary/20"></div>
          <div className="flex flex-col">
            <span className="text-xs font-bold text-secondary/60 uppercase tracking-tighter">
              Score moy.
            </span>
            <span className="text-2xl font-bold text-tertiary">88%</span>
          </div>
        </div>
      </header>

      {/* Search and Filter Bar */}
      <section className="bg-surface border border-secondary/20 p-4 rounded-2xl flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative">
          <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-secondary/60" />
          <input
            type="text"
            placeholder="Rechercher par matière, année ou professeur..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-neutral border-none rounded-xl py-3 pl-12 pr-4 outline-none focus:ring-2 focus:ring-primary/50 text-on-surface placeholder:text-secondary/60 transition-all font-medium"
          />
        </div>
        <a
          href="/student/exams/upload"
          className="bg-primary text-on-primary px-5 py-2.5 rounded-xl font-bold flex items-center gap-2 shadow-lg shadow-primary/20 hover:opacity-90 hover:-translate-y-0.5 active:translate-y-0 transition-all whitespace-nowrap"
        >
          <Plus size={18} strokeWidth={3} />
          Télécharger
        </a>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 scrollbar-hide">
          <span className="text-sm font-semibold text-secondary mr-2 whitespace-nowrap">
            Filtres :
          </span>
          <button
            onClick={() => setSelectedLevel("")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${selectedLevel === ""
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Tous les niveaux
          </button>
          <button
            onClick={() => setSelectedLevel("undergraduate")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${selectedLevel === "undergraduate"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Licence
          </button>
          <button
            onClick={() => setSelectedLevel("graduate")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${selectedLevel === "graduate"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Master
          </button>
          <button
            onClick={() => setSelectedLevel("phd")}
            className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap ${selectedLevel === "phd"
              ? "bg-primary text-on-primary shadow-sm"
              : "bg-neutral text-secondary hover:bg-secondary/10 transition-colors"
              }`}
          >
            Doctorat
          </button>
        </div>
      </section>

      {/* Exam Grid (Bento Style) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {isLoading && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-secondary font-medium">
            Chargement des examens...
          </div>
        )}

        {error && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-red-500 font-medium">
            {error}
          </div>
        )}

        {!isLoading && !error && examsData.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 text-center py-12 text-secondary font-medium">
            Aucun examen trouvé.
          </div>
        )}

        {!isLoading &&
          !error &&
          examsData.map((exam) => (
            <div
              key={exam.id}
              className="group bg-surface p-6 rounded-2xl shadow-sm border border-secondary/20 hover:border-primary/50 transition-all relative overflow-hidden flex flex-col h-full"
            >
              <div className="absolute top-0 right-0 p-4">
                <span className="bg-tertiary/10 text-tertiary text-[10px] font-bold px-2 py-1 rounded uppercase tracking-wider">
                  {exam.status === "validated" ? "Validé" : exam.status}
                </span>
              </div>
              <div className="mb-4">
                <div className="w-10 h-10 rounded-lg bg-secondary/10 flex items-center justify-center mb-3">
                  <FileText className="w-5 h-5 text-secondary" />
                </div>
                <h3 className="text-xl font-bold font-headline text-on-surface">
                  {exam.title}
                </h3>
                <p className="text-secondary/80 text-sm font-medium">
                  {exam.subject} {exam.year} • {exam.level}
                </p>
              </div>
              <div className="mt-auto flex items-end justify-between pt-4 border-t border-secondary/10">
                <div className="flex flex-col">
                  <span className="text-[10px] text-secondary/60 uppercase font-bold tracking-widest mb-1">
                    Questions
                  </span>
                  <span className="font-bold text-xl text-primary">
                    {exam.questions?.length || 0}
                  </span>
                </div>
                <a
                  href={exam.fileUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="bg-neutral text-on-surface px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-secondary/10 transition-colors"
                >
                  Consulter
                </a>
              </div>
            </div>
          ))}
      </div>

      {/* Subject Filter Pills */}
      <section className="mt-12 mb-4">
        <h3 className="text-xl font-headline font-bold text-on-surface mb-6 flex items-center gap-3">
          <Filter className="w-5 h-5 text-primary" />
          Filtrer par matière
        </h3>
        <div className="flex flex-wrap gap-3">
          {[
            "Mathématiques",
            "Sciences naturelles",
            "Sciences humaines",
            "Ingénierie",
            "Informatique",
            "Droit et politique",
            "Économie",
          ].map((subject) => (
            <button
              key={subject}
              className="px-6 py-3 rounded-xl bg-surface border border-secondary/20 font-semibold text-sm text-secondary hover:bg-primary hover:text-on-primary hover:border-primary transition-all shadow-sm"
            >
              {subject}
            </button>
          ))}
          <button className="px-6 py-3 rounded-xl bg-primary text-on-primary font-bold text-sm hover:opacity-90 transition-all shadow-sm">
            + Voir toutes les matières
          </button>
        </div>
      </section>
    </div>
  );
}
