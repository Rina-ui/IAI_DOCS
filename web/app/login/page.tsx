"use client";

import { Input } from "@/components/ui/input";
import tokenService from "@\/lib\/tokenService";
import { redirectByRole } from "@\/lib\/roleRedirect";
import { Building2, Eye, EyeOff, Sparkles } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import loginService from "./loginService";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const response = await loginService(email, password);

      // Debug: Log full response
      console.log("✅ Login successful, received response:", response);

      // Store token and user data
      tokenService.setToken(response.token);
      localStorage.setItem("user", JSON.stringify(response.user));

      // Debug: Log user role and redirect info
      console.log("👤 User authenticated with role:", response.user.role);
      console.log("📦 User data stored to localStorage:", {
        id: response.user.id,
        email: response.user.email,
        role: response.user.role,
      });

      // Redirect based on role
      redirectByRole(response.user.role);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Échec de la connexion";
      setError(message);
      console.error("Erreur de connexion:", err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex flex-col md:flex-row bg-neutral">
      {/* Left Side: Visual & Value Proposition */}
      <section className="relative w-full md:w-1/2 lg:w-3/5 bg-[url('/images/image.png')] bg-cover bg-center bg-no-repeat overflow-hidden flex items-center justify-center p-8 md:p-16">
        {/* Overlay for text readability */}
        <div className="absolute inset-0 bg-on-surface/80 z-0"></div>

        {/* Decorative background */}
        <div className="absolute inset-0 z-0 opacity-20">
          <div className="absolute top-0 right-0 w-96 h-96 bg-primary rounded-full blur-3xl"></div>
          <div className="absolute bottom-0 left-0 w-96 h-96 bg-tertiary rounded-full blur-3xl"></div>
        </div>

        {/* Branding Overlay */}
        <div className="relative z-10 max-w-xl">
          <div className="mb-12">
            <span className="font-bold text-4xl tracking-tight text-surface">
              IAI_DOCS
            </span>
            <div className="h-1 w-12 bg-primary mt-2 rounded-full"></div>
          </div>

          <h1 className="text-5xl md:text-6xl font-extrabold text-surface leading-tight mb-6 tracking-tight">
            L'Atelier Numérique de l'
            <span className="text-primary">Excellence Académique.</span>
          </h1>

          <p className="text-surface/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Propulsez votre recherche grâce à un espace de travail intelligent
            conçu pour le chercheur moderne. Structurez, analysez et synthétisez
            vos connaissances en toute simplicité.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="p-6 rounded-xl border border-surface/10 backdrop-blur-sm bg-surface/10">
              <Sparkles className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-surface text-lg">
                Synthèse par l'IA
              </h3>
              <p className="text-surface/80 text-sm mt-1">
                Transformez instantanément des articles denses en informations
                exploitables.
              </p>
            </div>
            <div className="p-6 rounded-xl border border-surface/10 backdrop-blur-sm bg-surface/10 mt-4 md:mt-8">
              <Building2 className="w-8 h-8 text-primary mb-3" />
              <h3 className="font-bold text-surface text-lg">
                Centré sur la Curation
              </h3>
              <p className="text-surface/80 text-sm mt-1">
                Une interface d'exception pour votre bibliothèque numérique.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Login Form */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-neutral">
        <div className="w-full max-w-md items-center justify-center text-center">
          {/* Header */}
          <div className="flex items-center justify-center">
            <Image
              src="/images/logoIAI.png"
              alt="Logo"
              width={200}
              height={200}
            />
          </div>

          <div className="mb-10 text-center">
            <h2 className="text-3xl font-bold text-on-surface mb-2">
              Heureux de vous revoir
            </h2>
            <p className="text-secondary">
              Accédez à votre espace de travail académique.
            </p>
          </div>

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* Email Field */}
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-semibold text-secondary mb-2"
              >
                Adresse e-mail
              </label>
              <Input
                id="email"
                type="email"
                placeholder="nom@universite.edu"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface placeholder:text-secondary/60"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <div className="flex justify-between mb-2">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold text-secondary"
                >
                  Mot de passe
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm font-semibold text-primary hover:text-primary/80 transition-colors"
                >
                  Mot de passe oublié ?
                </Link>
              </div>
              <div className="relative">
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface placeholder:text-secondary/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/60 hover:text-on-surface transition-colors"
                >
                  {showPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? "Connexion en cours..." : "Se connecter"}
            </button>
          </form>

          {/* Sign Up Link */}
          <div className="mt-10 text-center">
            <p className="text-secondary">
              Nouveau sur l'Atelier ?{" "}
              <Link
                href="/register"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Créer un compte
              </Link>
            </p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="absolute bottom-0 left-0 w-full md:w-1/2 lg:w-2/5 p-8 hidden md:block">
        <div className="flex justify-center gap-6 text-xs font-medium text-secondary/70 uppercase tracking-widest">
          <Link href="#" className="hover:text-primary transition-colors">
            Confidentialité
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Conditions
          </Link>
          <Link href="#" className="hover:text-primary transition-colors">
            Aide
          </Link>
        </div>
      </footer>
    </main>
  );
}
