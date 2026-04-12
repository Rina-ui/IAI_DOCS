"use client";

import { Input } from "@/components/ui/input";
import tokenService from "@\/lib\/tokenService";
import { Check, Eye, EyeOff } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import registerService from "./registerService";

export default function RegisterPage() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    level: "Terminale",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeToTerms, setAgreeToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (formData.password !== formData.confirmPassword) {
      setError("Les mots de passe ne correspondent pas");
      return;
    }

    if (!agreeToTerms) {
      setError("Veuillez accepter les Conditions et la Politique de confidentialité");
      return;
    }

    setIsLoading(true);

    try {
      const response = await registerService({
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        level: formData.level,
      });

      // Store token using tokenService
      tokenService.setToken(response.token);

      // Store user data in localStorage
      localStorage.setItem("user", JSON.stringify(response.user));

      // Redirect to dashboard
      window.location.href = "/dashboard";
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Échec de l'inscription";
      setError(message);
      console.error("Erreur d'inscription:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const passwordsMatch =
    formData.password === formData.confirmPassword &&
    formData.password.length > 0;

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
            Rejoignez l'<span className="text-primary">Atelier Numérique.</span>
          </h1>

          <p className="text-surface/80 text-lg md:text-xl leading-relaxed mb-10 max-w-lg">
            Commencez votre voyage vers l'excellence académique. Organisez,
            analysez et synthétisez la recherche avec des outils propulsés
            par l'IA conçus pour les chercheurs modernes.
          </p>

          {/* Value Props Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20 text-primary">
                  <Check className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-surface text-base">
                  Gratuit pour démarrer
                </h3>
                <p className="text-surface/80 text-sm mt-1">
                  Commencez gratuitement, évoluez à votre rythme.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4 mt-4 md:mt-8">
              <div className="flex-shrink-0">
                <div className="flex items-center justify-center h-10 w-10 rounded-lg bg-primary/20 text-primary">
                  <Check className="w-6 h-6" />
                </div>
              </div>
              <div>
                <h3 className="font-bold text-surface text-base">
                  Configuration Instantanée
                </h3>
                <p className="text-surface/80 text-sm mt-1">
                  Créez votre espace en quelques secondes.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Right Side: Register Form */}
      <section className="w-full md:w-1/2 lg:w-2/5 flex items-center justify-center p-8 md:p-12 lg:p-20 bg-neutral overflow-y-auto">
        <div className="w-full max-w-md py-8">
          {/* Header */}
          <div className="mb-10 text-center md:text-left">
            <h2 className="text-3xl font-bold text-on-surface mb-2">
              Créer un compte
            </h2>
            <p className="text-secondary">
              Rejoignez des milliers de chercheurs dans le monde entier.
            </p>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4 mb-8">
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-variant transition-colors rounded-xl font-medium text-sm text-on-surface ring-1 ring-secondary/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  fill="#4285F4"
                ></path>
                <path
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  fill="#34A853"
                ></path>
                <path
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                  fill="#FBBC05"
                ></path>
                <path
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  fill="#EA4335"
                ></path>
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 py-3 px-4 bg-surface hover:bg-surface-variant transition-colors rounded-xl font-medium text-sm text-on-surface ring-1 ring-secondary/20">
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  d="M11.4 24H0V12.6h11.4V24zM24 24H12.6V12.6H24V24zM11.4 11.4H0V0h11.4v11.4zM24 11.4H12.6V0H24v11.4z"
                  fill="#F25022"
                ></path>
              </svg>
              Microsoft
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center mb-8">
            <div className="flex-grow border-t border-secondary/20"></div>
            <span className="px-4 text-sm text-secondary/70 font-medium bg-neutral">
              Ou utiliser l'e-mail
            </span>
            <div className="flex-grow border-t border-secondary/20"></div>
          </div>

          {/* Register Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Error Message */}
            {error && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                {error}
              </div>
            )}

            {/* First Name Field */}
            <div>
              <label
                htmlFor="firstName"
                className="block text-sm font-semibold text-secondary mb-2"
              >
                Prénom
              </label>
              <Input
                id="firstName"
                name="firstName"
                type="text"
                placeholder="Jean"
                value={formData.firstName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface placeholder:text-secondary/60"
                required
              />
            </div>

            {/* Last Name Field */}
            <div>
              <label
                htmlFor="lastName"
                className="block text-sm font-semibold text-secondary mb-2"
              >
                Nom
              </label>
              <Input
                id="lastName"
                name="lastName"
                type="text"
                placeholder="Dupont"
                value={formData.lastName}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface placeholder:text-secondary/60"
                required
              />
            </div>

            {/* Level Field */}
            <div>
              <label
                htmlFor="level"
                className="block text-sm font-semibold text-secondary mb-2"
              >
                Niveau d'études
              </label>
              <select
                id="level"
                name="level"
                value={formData.level}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface cursor-pointer"
                required
              >
                <option value="Seconde">Seconde</option>
                <option value="Première">Première</option>
                <option value="Terminale">Terminale</option>
                <option value="Licence">Licence</option>
                <option value="Master">Master</option>
                <option value="Doctorat">Doctorat</option>
              </select>
            </div>

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
                name="email"
                type="email"
                placeholder="nom@universite.edu"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface placeholder:text-secondary/60"
                required
              />
            </div>

            {/* Password Field */}
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-semibold text-secondary mb-2"
              >
                Mot de passe
              </label>
              <div className="relative">
                <Input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.password}
                  onChange={handleChange}
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

            {/* Confirm Password Field */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="block text-sm font-semibold text-secondary mb-2"
              >
                Confirmer le mot de passe
              </label>
              <div className="relative">
                <Input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  placeholder="••••••••"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-surface border-0 rounded-xl ring-1 ring-secondary/20 focus:ring-2 focus:ring-primary/50 focus:bg-surface transition-all outline-none text-on-surface placeholder:text-secondary/60"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary/60 hover:text-on-surface transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
              {passwordsMatch && (
                <p className="text-sm text-primary mt-1 flex items-center gap-1">
                  <Check className="w-4 h-4" /> Les mots de passe correspondent
                </p>
              )}
            </div>

            {/* Terms & Conditions */}
            <div className="flex items-start gap-3">
              <input
                id="terms"
                type="checkbox"
                checked={agreeToTerms}
                onChange={(e) => setAgreeToTerms(e.target.checked)}
                className="w-5 h-5 rounded border-secondary/20 text-primary focus:ring-primary/20 cursor-pointer mt-0.5"
              />
              <label
                htmlFor="terms"
                className="text-sm text-secondary font-medium cursor-pointer leading-tight"
              >
                J'accepte les{" "}
                <a
                  href="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Conditions d'utilisation
                </a>{" "}
                et la{" "}
                <a
                  href="#"
                  className="text-primary font-semibold hover:underline"
                >
                  Politique de confidentialité
                </a>
              </label>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={isLoading || !agreeToTerms}
              className="w-full py-4 px-6 bg-primary text-on-primary font-bold rounded-full shadow-lg shadow-primary/20 hover:opacity-90 active:scale-[0.98] transition-all duration-200 disabled:opacity-60"
            >
              {isLoading ? "Création du compte..." : "Créer un compte"}
            </button>
          </form>

          {/* Sign In Link */}
          <div className="mt-10 text-center">
            <p className="text-secondary">
              Vous avez déjà un compte ?{" "}
              <Link
                href="/login"
                className="text-primary font-bold hover:underline underline-offset-4"
              >
                Se connecter
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
