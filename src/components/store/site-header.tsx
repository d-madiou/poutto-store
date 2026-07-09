import Link from "next/link";
import { User } from "lucide-react";
import { CartIcon } from "@/components/store/cart-icon";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-neutral-100 bg-white/95 backdrop-blur-md shadow-sm">
      {/* Top Marketplace Ticker Strip */}
      <div className="w-full bg-neutral-900 px-4 py-2">
        <div className="container max-w-7xl mx-auto flex items-center justify-between text-[10px] font-black uppercase tracking-wider text-neutral-300">
          <div className="flex items-center gap-1.5">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse" />
            <span>Artisanat Authentique du Fouta-Djallon</span>
          </div>
          <div className="hidden items-center gap-4 md:flex">
            <Link href="/contact" className="transition-colors hover:text-white">
              Service Client
            </Link>
            <span className="text-neutral-700">|</span>
            <span className="text-amber-400 font-bold">
              ⚡ Livraison partout en Guinée
            </span>
          </div>
        </div>
      </div>

      {/* Main E-Commerce Header Navigation Grid */}
      <div className="container max-w-7xl mx-auto flex h-16 items-center justify-between px-4 md:h-20">
        
        {/* Brand Identity / Logo Unit */}
        <Link
          href="/"
          className="flex items-center gap-1 font-sans text-lg font-black tracking-tight text-neutral-900 md:text-2xl"
        >
          <span className="text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-xl">POUTOU</span>
          <span className="text-neutral-900 font-bold tracking-wide">STORE</span>
        </Link>

        {/* High-Conversion Marketplace Header Action Nodes */}
        <nav className="flex items-center gap-3 md:gap-5">
          
          {/* Account Profile Node */}
          <Link
            href="/account"
            aria-label="Mon compte"
            className="group flex items-center gap-2.5 p-1 rounded-xl transition-all hover:bg-neutral-50"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-600 transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-600 group-hover:border-amber-500/20 md:h-11 md:w-11">
              <User className="h-4 w-4 md:h-5 md:w-5 stroke-[2.5]" />
            </div>
            <div className="hidden flex-col text-left leading-tight lg:flex">
              <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                Connexion
              </span>
              <span className="text-xs font-black text-neutral-800">Mon Compte</span>
            </div>
          </Link>
          
          {/* Subtle Vertical Utility Line - Hidden on Mobile to clear up action bars */}
          <div className="hidden h-8 w-[1px] bg-neutral-200 md:block" />

          {/* Checkout Cart Access Trigger Component */}
          <Link
            href="/cart"
            className="group flex items-center gap-2.5 p-1 rounded-xl transition-all hover:bg-neutral-50"
          >
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-neutral-50 border border-neutral-100 text-neutral-600 transition-colors group-hover:bg-amber-500/10 group-hover:text-amber-600 group-hover:border-amber-500/20 md:h-11 md:w-11">
              <CartIcon />
            </div>
            <div className="hidden flex-col text-left leading-tight lg:flex">
              <span className="text-[9px] font-bold tracking-wider text-neutral-400 uppercase">
                Panier
              </span>
              <span className="text-xs font-black text-neutral-800">Acheter</span>
            </div>
          </Link>

        </nav>
      </div>
    </header>
  );
}