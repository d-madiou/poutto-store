"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { signUp } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 6) {
      setError("Le mot de passe doit contenir au moins 6 caractères.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Les mots de passe ne correspondent pas.");
      return;
    }

    setSubmitting(true);
    const result = await signUp(email, password, name);
    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    setDone(true);
  }

  if (done) {
    return (
      <div className="w-full max-w-md mx-auto bg-white border border-gray-200 rounded-2xl p-8 text-center font-poppins">
        <div className="mx-auto w-16 h-16 rounded-full bg-emerald-50 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
        <h2 className="text-xl font-bold text-gray-900">Compte créé !</h2>
        <p className="mt-2 text-sm text-gray-500">
          Vérifiez votre boîte e-mail pour confirmer votre compte avant de vous connecter.
        </p>
      </div>
    );
  }

  return (
    <div className="w-full font-poppins">
      <div className="grid md:grid-cols-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        {/* Colonne image - visible uniquement sur desktop */}
        <div className="hidden md:block md:col-span-2 relative bg-[#fafafa]">
          <div className="absolute inset-0 bg-gradient-to-br from-[#E07B39]/5 via-transparent to-transparent" />
          <div className="relative h-full w-full p-8 flex flex-col items-center justify-center">
            <div className="relative w-48 h-48 mb-6">
              <Image
                src="/images/hero-images/hero1.png"
                alt="Bonnet Poutou"
                fill
                className="object-contain drop-shadow-xl"
                priority
              />
            </div>
            <div className="text-center">
              <h3 className="text-xl font-bold text-gray-900">Poutou Store</h3>
              <p className="mt-2 text-sm text-gray-500 max-w-xs">
                Rejoignez l&apos;univers de l&apos;artisanat authentique du Fouta-Djallon.
              </p>
            </div>
          </div>
        </div>

        {/* Colonne formulaire */}
        <div className="md:col-span-3 p-6 sm:p-8 lg:p-10">
          {/* Logo et titre visibles sur mobile */}
          <div className="md:hidden flex flex-col items-center mb-6">
            <div className="relative w-20 h-20 mb-3">
              <Image
                src="/images/hero-images/hero1.png"
                alt="Bonnet Poutou"
                fill
                className="object-contain"
                priority
              />
            </div>
            <h2 className="text-lg font-bold text-gray-900">Créez votre compte</h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              Artisanat authentique du Fouta-Djallon
            </p>
          </div>

          <div className="hidden md:block mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Créez votre compte</h2>
            <p className="text-sm text-gray-500 mt-1">
              Une expérience d&apos;achat unique vous attend.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Nom complet
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Votre nom et prénom"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                E-mail
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="exemple@mail.com"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                autoComplete="new-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Au moins 6 caractères"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
                Confirmer le mot de passe
              </label>
              <input
                id="confirmPassword"
                type="password"
                required
                autoComplete="new-password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Répétez votre mot de passe"
                className="h-12 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
              />
            </div>

            {error && (
              <div className="rounded-xl bg-red-50 border border-red-100 p-3 text-sm font-medium text-red-600">
                {error}
              </div>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={submitting}
              className="h-12 w-full rounded-xl bg-[#E07B39] text-white font-semibold text-sm transition-colors hover:bg-orange-600 disabled:opacity-60"
            >
              {submitting ? "Création…" : "Créer mon compte"}
            </Button>

            <p className="text-center text-sm text-gray-500">
              Déjà un compte ?{" "}
              <Link href="/login" className="font-semibold text-[#E07B39] hover:text-orange-700 transition-colors">
                Se connecter
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}