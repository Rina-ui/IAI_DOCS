"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createExam } from "@/lib/examService";
import { Upload, AlertCircle, CheckCircle, FileText } from "lucide-react";

export default function UploadExamPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Form state
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("");
  const [year, setYear] = useState(new Date().getFullYear().toString());
  const [level, setLevel] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      setFile(e.dataTransfer.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!file) {
      setError("Veuillez sélectionner un fichier PDF");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setSuccess(false);

      await createExam({
        title,
        subject,
        year: parseInt(year),
        level,
        file,
      });

      setSuccess(true);
      setTimeout(() => {
        router.push("/student/exams");
      }, 2000);
    } catch (err) {
      setError("Impossible de télécharger l'examen. Veuillez réessayer.");
      console.error("Failed to upload exam:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Header */}
      <header>
        <h1 className="text-4xl font-extrabold tracking-tight text-on-surface mb-2 font-headline">
          Télécharger un examen
        </h1>
        <p className="text-secondary max-w-lg flex items-center gap-2">
          <Upload size={16} className="text-primary shrink-0" />
          Ajoutez un nouvel examen au système avec correction IA.
        </p>
      </header>

      {error && (
        <div className="bg-error/10 border border-error/20 rounded-2xl p-4 text-error flex items-start gap-3">
          <AlertCircle size={20} className="shrink-0 mt-0.5" />
          <p className="font-medium">{error}</p>
        </div>
      )}

      {success && (
        <div className="bg-tertiary/10 border border-tertiary/20 rounded-2xl p-4 text-tertiary flex items-start gap-3">
          <CheckCircle size={20} className="shrink-0 mt-0.5" />
          <p className="font-medium">Examen téléchargé avec succès ! Redirection...</p>
        </div>
      )}

      {/* Upload Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-surface border border-secondary/20 rounded-2xl p-6 space-y-6">
          {/* File Upload */}
          <div>
            <label className="block text-sm font-bold text-on-surface mb-2">
              Fichier PDF <span className="text-error">*</span>
            </label>
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-colors ${dragActive
                ? "border-primary bg-primary/5"
                : "border-secondary/20 hover:border-primary/40"
                }`}
            >
              <input
                type="file"
                accept=".pdf"
                onChange={handleFileChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                required
              />
              <FileText size={48} className="text-primary mx-auto mb-3" />
              {file ? (
                <div>
                  <p className="font-bold text-on-surface mb-1">{file.name}</p>
                  <p className="text-sm text-secondary">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                </div>
              ) : (
                <div>
                  <p className="font-bold text-on-surface mb-1">
                    Glissez-déposez votre fichier PDF ici
                  </p>
                  <p className="text-sm text-secondary">ou cliquez pour sélectionner</p>
                </div>
              )}
              <p className="text-xs text-secondary mt-2">PDF uniquement, max 10MB</p>
            </div>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-bold text-on-surface mb-2">
              Titre de l'examen <span className="text-error">*</span>
            </label>
            <input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Examen Final - Mathématiques 2024"
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>

          {/* Subject & Level */}
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="subject" className="block text-sm font-bold text-on-surface mb-2">
                Matière <span className="text-error">*</span>
              </label>
              <input
                id="subject"
                type="text"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder="Mathématiques"
                className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              />
            </div>

            <div>
              <label htmlFor="level" className="block text-sm font-bold text-on-surface mb-2">
                Niveau <span className="text-error">*</span>
              </label>
              <select
                id="level"
                value={level}
                onChange={(e) => setLevel(e.target.value)}
                className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface focus:outline-none focus:ring-2 focus:ring-primary/50"
                required
              >
                <option value="">Sélectionner un niveau</option>
                <option value="undergraduate">Licence</option>
                <option value="graduate">Master</option>
                <option value="phd">Doctorat</option>
              </select>
            </div>
          </div>

          {/* Year */}
          <div>
            <label htmlFor="year" className="block text-sm font-bold text-on-surface mb-2">
              Année <span className="text-error">*</span>
            </label>
            <input
              id="year"
              type="number"
              value={year}
              onChange={(e) => setYear(e.target.value)}
              placeholder="2024"
              min="2000"
              max={new Date().getFullYear() + 1}
              className="w-full bg-neutral border border-secondary/20 rounded-xl px-4 py-3 text-on-surface placeholder:text-secondary/60 focus:outline-none focus:ring-2 focus:ring-primary/50"
              required
            />
          </div>
        </div>

        {/* Submit Button */}
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-neutral text-secondary px-6 py-3.5 rounded-xl font-bold hover:bg-secondary/10 transition-colors"
          >
            Annuler
          </button>
          <button
            type="submit"
            disabled={loading || !file}
            className="flex-1 bg-primary text-on-primary px-6 py-3.5 rounded-xl font-bold shadow-lg shadow-primary/20 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 transition-all"
          >
            {loading ? "Téléchargement..." : "Télécharger l'examen"}
          </button>
        </div>
      </form>
    </div>
  );
}
