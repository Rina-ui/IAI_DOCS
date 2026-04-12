import { getExams } from "@\/lib\/examService";
import type { Exam } from "@\/lib\/types";

export default async function TrainingPage() {
  let exams: Exam[] = [];
  let error: string | null = null;

  try {
    exams = await getExams();
  } catch (err) {
    error = "Impossible de charger les examens disponibles.";
    console.error("Failed to fetch exams:", err);
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          Entraînement
        </h1>
        <p className="text-secondary max-w-lg flex items-center gap-2">
          Choisissez un examen pour commencer votre session d'entraînement avec correction IA.
        </p>
      </header>

      {error ? (
        <div className="bg-error/10 border border-error/20 rounded-2xl p-6 text-error">
          <p className="font-bold">{error}</p>
        </div>
      ) : (
        <div className="grid gap-4">
          {exams.map((exam) => (
            <a
              key={exam.id}
              href={`/student/training/${exam.id}`}
              className="bg-surface border border-secondary/20 rounded-2xl p-6 hover:border-primary/40 hover:shadow-xl hover:shadow-black/5 transition-all duration-300 group"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-bold text-on-surface mb-2 group-hover:text-primary transition-colors">
                    {exam.title}
                  </h3>
                  <div className="flex flex-wrap gap-2 text-sm text-secondary">
                    <span className="bg-neutral px-3 py-1 rounded-lg font-medium">
                      {exam.subject}
                    </span>
                    <span className="bg-neutral px-3 py-1 rounded-lg font-medium">
                      {exam.level}
                    </span>
                    <span className="bg-neutral px-3 py-1 rounded-lg font-medium">
                      {exam.year}
                    </span>
                    <span className="bg-neutral px-3 py-1 rounded-lg font-medium">
                      {exam.questions.length} questions
                    </span>
                  </div>
                </div>
                <span
                  className={`text-xs font-bold px-3 py-1.5 rounded-lg ${exam.status === "validated"
                      ? "bg-tertiary/10 text-tertiary"
                      : "bg-secondary/10 text-secondary"
                    }`}
                >
                  {exam.status === "validated" ? "Validé" : "En attente"}
                </span>
              </div>
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
