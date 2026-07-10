"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signIn } from "@/actions/auth";
import { Button } from "@/components/ui/button";

export function LoginForm({ initialError }: { initialError?: string }) {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(initialError ?? null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await signIn(email, password);

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    router.push("/");
    router.refresh();
  }

  return (
    <div className="w-full font-poppins">
      <div className="grid md:grid-cols-5 overflow-hidden rounded-2xl border border-gray-200 bg-white">
        
        {/* Colonne image (desktop) */}
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
                Bienvenue à nouveau. Connectez-vous pour retrouver votre espace.
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
            <h2 className="text-lg font-bold text-gray-900">Connexion</h2>
            <p className="text-sm text-gray-500 text-center mt-1">
              Artisanat authentique du Fouta-Djallon
            </p>
          </div>

          <div className="hidden md:block mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Connexion</h2>
            <p className="text-sm text-gray-500 mt-1">
              Accédez à votre compte et suivez vos commandes.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
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
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Votre mot de passe"
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
              {submitting ? "Connexion…" : "Se connecter"}
            </Button>

            <div className="space-y-2 text-center text-sm">
              <Link href="/forgot-password" className="block text-gray-600 hover:text-[#E07B39] transition-colors">
                Mot de passe oublié ?
              </Link>
              <p className="text-gray-500">
                Pas encore de compte ?{" "}
                <Link href="/signup" className="font-semibold text-[#E07B39] hover:text-orange-700 transition-colors">
                  Créer un compte
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}