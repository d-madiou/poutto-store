import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";
import { HeroSection } from "@/components/store/hero-section";
import { Flame, ArrowRight, Grid } from "lucide-react";

export default async function HomePage() {
  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: { status: "ACTIVE" },
      orderBy: { createdAt: "desc" },
      take: 8,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const storeProducts = products.map(serializeProduct);

  return (
    <div className="bg-neutral-50/50 min-h-screen">
      {/* Hero Showcase Module */}
      <HeroSection />

      {/* Categories Horizontal Carousel Filter Bar */}
      {categories.length > 0 && (
        <section className="bg-white border-b border-neutral-200/60 shadow-xs">
          <div className="container max-w-7xl mx-auto px-4 py-4">
            <div className="flex items-center gap-2 mb-2 text-[11px] font-black text-neutral-400 uppercase tracking-wider">
              <Grid className="h-3.5 w-3.5" />
              <span>Explorer par univers</span>
            </div>
            <div className="flex gap-2.5 overflow-x-auto pb-1 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/products?category=${category.slug}`}
                  className="shrink-0 h-9 flex items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 text-xs font-bold text-neutral-700 transition-all shadow-xs hover:bg-neutral-50 hover:border-neutral-300 hover:text-neutral-900"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Products Flash Grid Section */}
      <section className="container max-w-7xl mx-auto px-4 py-8 pb-20">
        
        {/* Marketplace Section Title Bar Header */}
        <div className="mb-5 flex items-center justify-between border-b border-neutral-200/60 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-red-500/10 text-red-500">
              <Flame className="h-4 w-4 fill-current" />
            </div>
            <h2 className="text-sm font-black uppercase tracking-wider text-neutral-900">
              Nouveautés flash
            </h2>
          </div>
          
          <Link
            href="/products"
            className="flex items-center gap-1 text-xs font-black uppercase tracking-wider text-amber-600 hover:text-amber-500 transition-colors"
          >
            <span>Tout voir</span>
            <ArrowRight className="h-3.5 w-3.5 stroke-[2.5]" />
          </Link>
        </div>

        {/* Dynamic Infinite Style Grid Display */}
        {storeProducts.length === 0 ? (
          <div className="border border-neutral-200 bg-white rounded-2xl p-16 text-center shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Aucun produit pour le moment. Revenez bientôt !
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}