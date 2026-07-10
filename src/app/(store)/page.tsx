import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/store/hero-section";
import { ArrowRight } from "lucide-react";
import { PromoBanner } from "@/components/store/promoBanner";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8, // On garde 8 pour desktop, mobile affichera seulement les 4 premiers
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const storeProducts = products.map(serializeProduct);
  const mobileProducts = storeProducts.slice(0, 4); // Seulement 4 pour mobile

  return (
    <div className="bg-white min-h-screen font-poppins">
      {/* Hero */}
      <HeroSection />

      {/* Catégories */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-gray-200">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
                Explorer par univers
              </span>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-1 scrollbar-none">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="shrink-0 h-9 flex items-center justify-center rounded-full border border-gray-200 bg-white px-4 text-xs font-semibold text-gray-700 hover:border-gray-300 hover:text-gray-900 transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Produits */}
      <section className="container max-w-7xl mx-auto px-4 py-8 pb-24">
        {/* En-tête */}
        <div className="mb-5 flex items-center justify-between">
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Nouveautés
          </h2>
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs font-semibold text-[#E07B39] hover:text-orange-600 transition-colors"
          >
            Tout voir
            <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        {/* Grille Desktop : 8 produits */}
        <div className="hidden md:grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {storeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Grille Mobile : 4 produits + bouton */}
        <div className="md:hidden">
          <div className="grid grid-cols-2 gap-3">
            {mobileProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
          {storeProducts.length > 4 && (
            <div className="mt-6 flex justify-center">
              <Button
                asChild
                className="h-12 px-8 rounded-xl bg-[#E07B39] text-white font-semibold text-sm hover:bg-orange-600 transition-colors"
              >
                <Link href="/products" className="flex items-center gap-2">
                  Voir toute la collection
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
            </div>
          )}
        </div>

        {/* Fallback vide */}
        {storeProducts.length === 0 && (
          <div className="text-center py-16">
            <p className="text-sm font-medium text-gray-500">
              Aucun produit pour le moment. Revenez bientôt !
            </p>
          </div>
        )}

        <div className="mt-10">
          <PromoBanner />
        </div>
      </section>
    </div>
  );
}