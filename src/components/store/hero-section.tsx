"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Star, ShieldCheck } from "lucide-react";

export function HeroSection() {
  const slides = [
    {
      image: "/images/hero-images/hero1.png",
      tag: "🔥 TOP VENTE CE MOIS",
      title: "L'excellence du bonnet fulani",
      desc: "Authentique Poutou traditionnel tissé main au Fouta-Djallon. Qualité premium certifiée.",
      price: "150 000 GNF",
      originalPrice: "190 000 GNF",
      sales: "1,2k+ vendus",
    },
    {
      image: "/images/hero-images/hero2.png",
      tag: "⚡ ÉDITION LIMITÉE",
      title: "Tissé main au Fouta-Djallon",
      desc: "Édition spéciale d'exception. Broderies fines faites à la main par nos maîtres artisans.",
      price: "180 000 GNF",
      originalPrice: "220 000 GNF",
      sales: "450+ vendus",
    },
  ];

  return (
    <section className="w-full bg-neutral-950 p-4 sm:p-6 lg:p-8 overflow-hidden">
      <div className="mx-auto max-w-7xl">
        
        {/* 
          MOBILE-FIRST CAROUSEL WRAPPER:
          On mobile (< sm), it changes into a single-line, horizontally scrollable layout (`flex overflow-x-auto snap-x snap-mandatory scrollbar-none`).
          On desktop (≥ lg), it reverts cleanly to your explicit `grid grid-cols-12` structural design layouts.
        */}
        <div className="flex overflow-x-auto snap-x snap-mandatory scrollbar-none gap-4 pb-4 -mx-4 px-4 sm:mx-0 sm:px-0 lg:grid lg:grid-cols-12 lg:gap-4 lg:overflow-visible lg:pb-0">
          
          {/* Main Left Feature Banner */}
          <div className="relative shrink-0 w-[88vw] sm:w-auto snap-center overflow-hidden rounded-2xl px-6 py-12 text-white sm:px-12 sm:py-16 lg:col-span-8 flex flex-col justify-between min-h-[420px] sm:min-h-[460px] shadow-xl">
            {/* Underlying Web Background Image Asset */}
            <div 
              className="absolute inset-0 bg-cover bg-center pointer-events-none transform scale-105"
              style={{ backgroundImage: "url('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSxakOPZ3TbVjamSKjMSAHpRlI_zi_XJmUqjO4KIF31hrBBvkkqL8rBc1O8&s=10')" }}
            />

            {/* Overlay Gradients */}
            <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-600/85 to-blue-800/95 mix-blend-multiply pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-neutral-950 via-transparent to-transparent pointer-events-none" />
            <div className="absolute inset-0 bg-[radial-gradient(#ffffff03_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
            
            <div className="relative z-10 max-w-md">
              <span className="text-[10px] font-black uppercase tracking-widest text-amber-200 drop-shadow-xs">
                NEW ARRIVALS
              </span>
              <h1 className="mt-4 font-sans text-3xl font-black uppercase leading-tight tracking-tight sm:text-4xl md:text-5xl drop-shadow-md">
                POUTOU <br />
                <span className="text-amber-300">TRADITIONNEL</span>
              </h1>
              <p className="mt-3 text-xs font-medium text-amber-50/90 sm:text-sm drop-shadow-xs">
                Authentique collection de bonnets Fulani d&apos;origine certifiée, entièrement tissés main par nos artisans.
              </p>

              {/* Minimalist Badges */}
              <div className="mt-4 flex flex-wrap gap-2 text-[11px] font-bold">
                <span className="inline-flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 backdrop-blur-md border border-white/5">
                  <Star className="h-3 w-3 fill-amber-300 text-amber-300" /> 4.9 Global
                </span>
                <span className="inline-flex items-center gap-1 rounded-md bg-black/30 px-2 py-1 backdrop-blur-md border border-white/5">
                  <ShieldCheck className="h-3 w-3 text-emerald-300" /> Fouta Authentique
                </span>
              </div>
            </div>

            {/* CTA Platform */}
            <div className="relative z-10 mt-8">
              <Button 
                asChild
                className="h-11 rounded-full bg-white px-8 text-xs font-black uppercase tracking-wider text-orange-950 transition-all hover:bg-neutral-50 hover:scale-[1.02] active:scale-[0.98] shadow-lg"
              >
                <Link href="/products">Shop Now</Link>
              </Button>
            </div>
          </div>

          {/* 
            Right Column Wrapper Modded for Mobile Lineup:
            Instead of nesting structural block layout code, we match mobile behaviors with `contents` or `flex` arrays so they flow on the exact same carousel axis.
          */}
          <div className="contents lg:grid lg:grid-cols-1 lg:gap-4 lg:col-span-4">
            
            {/* Top Split Card — Purple Canvas with Oversized Image Asset */}
            <div className="relative shrink-0 w-[88vw] sm:w-auto snap-center overflow-hidden rounded-2xl bg-gradient-to-r from-purple-900 to-indigo-950 p-4 flex items-center justify-center group min-h-[420px] sm:min-h-[222px]">
              {/* Maximize image canvas scales inside card limits */}
              <div className="relative w-[115%] h-[115%] sm:w-full sm:h-full max-h-[340px] sm:max-w-[210px] sm:max-h-[210px] aspect-square filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={slides[0].image}
                  alt={slides[0].title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>

            {/* Bottom Split Card — Red Canvas with Oversized Image Asset */}
            <div className="relative shrink-0 w-[88vw] sm:w-auto snap-center overflow-hidden rounded-2xl bg-gradient-to-r from-red-600 to-rose-800 p-4 flex items-center justify-center group min-h-[420px] sm:min-h-[222px]">
              {/* Maximize image canvas scales inside card limits */}
              <div className="relative w-[115%] h-[115%] sm:w-full sm:h-full max-h-[340px] sm:max-w-[210px] sm:max-h-[210px] aspect-square filter drop-shadow-[0_20px_35px_rgba(0,0,0,0.7)] transition-transform duration-500 group-hover:scale-105">
                <Image
                  src={slides[1].image}
                  alt={slides[1].title}
                  fill
                  priority
                  className="object-contain"
                />
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}