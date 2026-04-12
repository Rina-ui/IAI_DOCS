"use client";

import { useEffect } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";

export default function StudentError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("Student route error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="text-center max-w-md">
        <div className="w-20 h-20 bg-error/10 rounded-full flex items-center justify-center mx-auto mb-6">
          <AlertTriangle size={40} className="text-error" />
        </div>
        <h2 className="text-2xl font-bold text-on-surface mb-3">
          Une erreur s'est produite
        </h2>
        <p className="text-secondary mb-6">
          {error.message || "Impossible de charger cette page. Veuillez réessayer."}
        </p>
        <div className="flex gap-3 justify-center">
          <button
            onClick={reset}
            className="bg-primary text-on-primary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={18} />
            Réessayer
          </button>
          <a
            href="/student"
            className="bg-neutral text-secondary px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-secondary/10 transition-colors"
          >
            <Home size={18} />
            Accueil
          </a>
        </div>
      </div>
    </div>
  );
}
