import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function PromoBanner() {
  return (
    <div className="relative rounded-2xl bg-[#111111] overflow-hidden font-poppins">
      {/* Effets subtils */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#E07B39]/15 via-transparent to-transparent pointer-events-none" />
      <div className="absolute -bottom-20 -left-20 w-60 h-60 rounded-full bg-[#E07B39]/10 blur-3xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row items-center gap-6 px-6 py-10 md:px-12 md:py-14">
        {/* Image */}
        <div className="order-2 md:order-1 flex-shrink-0 w-40 h-40 sm:w-48 sm:h-48 md:w-56 md:h-56 relative">
          <Image
            src="/images/hero-images/hero1.png"
            alt="Promotion artisanat"
            fill
            className="object-contain drop-shadow-2xl"
            priority
          />
        </div>

        {/* Texte & CTA */}
        <div className="order-1 md:order-2 flex-1 text-center md:text-left space-y-4">
          <div className="inline-block rounded-full bg-[#E07B39]/15 backdrop-blur-sm text-[#E07B39] px-3 py-1 text-[10px] font-semibold uppercase tracking-wider">
            Offre limitée
          </div>
          <h3 className="text-2xl sm:text-3xl font-bold text-white leading-tight">
            -20% sur votre première commande
          </h3>
          <p className="text-sm text-gray-400 max-w-md mx-auto md:mx-0">
            Plongez dans l&apos;univers du Fouta-Djallon avec nos bonnets tissés
            main. Une pièce d&apos;exception à prix doux.
          </p>
          <Button
            asChild
            size="lg"
            className="h-11 rounded-xl bg-[#E07B39] text-white font-semibold text-sm px-6 hover:bg-orange-600 transition-colors"
          >
            <Link href="/products?promo=first" className="inline-flex items-center gap-2">
              Découvrir l&apos;offre
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>
    </div>
  );
}