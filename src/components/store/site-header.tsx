import Link from "next/link";
import { User, MessageCircle } from "lucide-react";
import { CartIcon } from "@/components/store/cart-icon";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full font-poppins">
      {/* Bandeau supérieur orange vif */}
      <div className="w-full bg-[#E07B39] text-white">
        <div className="container max-w-7xl mx-auto flex items-center justify-between px-4 py-2 text-xs font-medium tracking-wide">
          <div className="flex items-center gap-2">
            <span className="h-1.5 w-1.5 rounded-full bg-white opacity-90" />
            <span>Artisanat d&apos;exception · Fouta-Djallon</span>
          </div>
          <div className="hidden md:flex items-center gap-4">
            <Link href="/contact" className="hover:underline underline-offset-2">
              Conciergerie
            </Link>
            <span className="text-white/40">|</span>
            <span className="font-semibold">Livraison offerte en Guinée</span>
          </div>
        </div>
      </div>

      {/* Barre de navigation principale */}
      <div className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-gray-900">
              POUTOU
            </span>
            <span className="text-sm font-light text-gray-400 tracking-[0.15em] uppercase">
              Store
            </span>
          </Link>

          {/* Actions (desktop) */}
          <nav className="hidden md:flex items-center gap-2 md:gap-4">
            <Link
              href="/account"
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-[#E07B39] hover:text-white"
            >
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors">
                <User className="h-4 w-4 stroke-[2.5]" />
              </div>
              <div className="hidden flex-col text-left lg:flex">
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                  Mon compte
                </span>
                <span className="text-sm font-semibold">Connexion</span>
              </div>
            </Link>

            <div className="h-6 w-px bg-gray-200 hidden md:block" />

            <Link
              href="/cart"
              className="group flex items-center gap-2 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-[#E07B39] hover:text-white"
            >
              <div className="relative flex h-10 w-10 items-center justify-center rounded-lg bg-gray-100 group-hover:bg-white/20 transition-colors">
                <CartIcon />
              </div>
              <div className="hidden flex-col text-left lg:flex">
                <span className="text-[10px] font-medium uppercase tracking-wider opacity-70">
                  Panier
                </span>
                <span className="text-sm font-semibold">Voir</span>
              </div>
            </Link>
          </nav>

          {/* Mobile : Vente en gros + WhatsApp */}
          <div className="flex md:hidden items-center gap-3">
            <span className="text-xs font-semibold text-gray-700">
              Vente en gros
            </span>
            <a
              href="https://wa.me/224XXXXXXXXX"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Discuter sur WhatsApp"
              className="flex h-9 w-9 items-center justify-center rounded-full bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
            >
              <MessageCircle className="h-4 w-4 fill-current" />
            </a>
          </div>
        </div>
      </div>
    </header>
  );
}