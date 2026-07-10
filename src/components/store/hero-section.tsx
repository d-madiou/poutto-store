"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";

export function HeroSection() {
  const slides = [
    {
      image: "/images/hero-images/hero1.png",
      tag: "TOP VENTE",
      title: "L'excellence du bonnet fulani",
      desc: "Tissé main au Fouta-Djallon. Authenticité certifiée.",
      price: "150 000 GNF",
      originalPrice: "190 000 GNF",
    },
    {
      image: "/images/hero-images/hero2.png",
      tag: "ÉDITION LIMITÉE",
      title: "Tissé main au Fouta-Djallon",
      desc: "Broderies fines faites par nos maîtres artisans.",
      price: "180 000 GNF",
      originalPrice: "220 000 GNF",
    },
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  const nextSlide = () => setCurrentSlide((prev) => (prev + 1) % slides.length);
  const prevSlide = () => setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);

  return (
    <section className="relative w-full bg-white font-poppins overflow-hidden">
      <div className="relative max-w-5xl mx-auto">
        {/* Slider container */}
        <div
          className="flex transition-transform duration-500 ease-out"
          style={{ transform: `translateX(-${currentSlide * 100}%)` }}
        >
          {slides.map((slide, idx) => (
            <div key={idx} className="w-full flex-shrink-0 px-4 pt-6 pb-2">
              {/* Image — grande, sans cadre, centrée */}
              <div className="relative w-full aspect-[5/6] mx-auto max-w-xs sm:max-w-sm">
                <Image
                  src={slide.image}
                  alt={slide.title}
                  fill
                  className="object-contain"
                  priority={idx === 0}
                  sizes="(max-width: 640px) 90vw, 400px"
                />
              </div>

              {/* Texte compact en dessous */}
              <div className="mt-3 text-center space-y-2">
                <span className="inline-block text-[11px] font-semibold uppercase tracking-wider text-orange-600 bg-orange-50 px-2.5 py-0.5 rounded-full">
                  {slide.tag}
                </span>
                <h2 className="text-xl font-bold text-gray-900 leading-snug px-2">
                  {slide.title}
                </h2>
                <p className="text-sm text-gray-500 max-w-[280px] mx-auto">
                  {slide.desc}
                </p>

                {/* Prix */}
                <div className="flex items-center justify-center gap-2">
                  <span className="text-2xl font-bold text-gray-900">
                    {slide.price}
                  </span>
                  {slide.originalPrice && (
                    <span className="text-sm text-gray-400 line-through">
                      {slide.originalPrice}
                    </span>
                  )}
                </div>

                {/* Bouton d'action */}
                <Button
                  asChild
                  className="mt-3 h-11 px-8 rounded-full bg-orange-500 text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
                >
                  <Link href="/products">Découvrir</Link>
                </Button>
              </div>
            </div>
          ))}
        </div>

        {/* Flèches de navigation (toujours visibles pour le confort tactile) */}
        <button
          onClick={prevSlide}
          className="absolute left-2 top-[30%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
          aria-label="Précédent"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2 top-[30%] -translate-y-1/2 w-9 h-9 rounded-full bg-white shadow-lg flex items-center justify-center text-gray-700 hover:bg-gray-50 transition"
          aria-label="Suivant"
        >
          <ChevronRight className="h-5 w-5" />
        </button>

        {/* Indicateurs */}
        <div className="flex justify-center gap-2 pb-5 pt-2">
          {slides.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentSlide(idx)}
              className={`h-2 rounded-full transition-all duration-300 ${
                idx === currentSlide
                  ? "w-8 bg-orange-500"
                  : "w-2 bg-gray-300 hover:bg-gray-400"
              }`}
              aria-label={`Aller à la slide ${idx + 1}`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}