import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { ProductCard } from "@/components/store/product-card";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Grid2x2, SlidersHorizontal, Layers } from "lucide-react";

type SortOption = "newest" | "price-asc" | "price-desc";

function isSortOption(value: string | undefined): value is SortOption {
  return value === "newest" || value === "price-asc" || value === "price-desc";
}

export default async function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<{ category?: string; sort?: string }>;
}) {
  const params = await searchParams;
  const activeCategory = params.category;
  const sort: SortOption = isSortOption(params.sort) ? params.sort : "newest";

  const orderBy =
    sort === "price-asc"
      ? { price: "asc" as const }
      : sort === "price-desc"
      ? { price: "desc" as const }
      : { createdAt: "desc" as const };

  const [products, categories] = await Promise.all([
    prisma.product.findMany({
      where: {
        status: "ACTIVE",
        ...(activeCategory ? { category: { slug: activeCategory } } : {}),
      },
      orderBy,
      include: { category: true },
    }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  const storeProducts = products.map(serializeProduct);

  const sortLabels: Record<SortOption, string> = {
    newest: "Nouveautés",
    "price-asc": "Prix croissant",
    "price-desc": "Prix décroissant",
  };

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-24">
      <div className="container max-w-7xl mx-auto px-4 py-6 md:px-6 md:py-8">
        
        {/* Modern Marketplace Page Title & Counter Module */}
        <div className="flex flex-col gap-2 border-b border-neutral-200/80 pb-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
              <Grid2x2 className="h-4 w-4 stroke-[2.5]" />
            </div>
            <h1 className="text-sm font-black uppercase tracking-wider text-neutral-900">
              Notre collection
            </h1>
          </div>
          <span className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-[11px] font-bold text-neutral-600">
            {storeProducts.length} modèle{storeProducts.length > 1 ? "s" : ""} disponible{storeProducts.length > 1 ? "s" : ""}
          </span>
        </div>

        {/* Categories Pills Filter Strip — Smooth marketplace capsule scrolling layout */}
        <div className="mt-5 space-y-2">
          <div className="flex items-center gap-1 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            <Layers className="h-3.5 w-3.5 text-neutral-400" />
            <span>Catégories</span>
          </div>
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              href="/products"
              className={cn(
                "shrink-0 h-9 flex items-center justify-center rounded-xl px-4 text-xs font-bold transition-all border shadow-sm",
                !activeCategory
                  ? "bg-neutral-900 border-neutral-900 text-white"
                  : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
              )}
            >
              Tout voir
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={cn(
                  "shrink-0 h-9 flex items-center justify-center rounded-xl px-4 text-xs font-bold transition-all border shadow-sm",
                  activeCategory === category.slug
                    ? "bg-neutral-900 border-neutral-900 text-white"
                    : "bg-white border-neutral-200 text-neutral-700 hover:bg-neutral-50 hover:text-neutral-900"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Sorting Navigation Bar — Crisp dropdown alternative layout optimized for high conversion */}
        <div className="mt-4 flex flex-col gap-3 bg-white border border-neutral-200/60 p-3 rounded-2xl shadow-sm sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-neutral-400">
            <SlidersHorizontal className="h-3.5 w-3.5" />
            <span>Trier par :</span>
          </div>
          
          <div className="flex flex-wrap gap-1.5 w-full sm:w-auto">
            {(Object.keys(sortLabels) as SortOption[]).map((option) => {
              const qs = new URLSearchParams();
              if (activeCategory) qs.set("category", activeCategory);
              qs.set("sort", option);
              const isActive = sort === option;
              return (
                <Link
                  key={option}
                  href={`/products?${qs.toString()}`}
                  className={cn(
                    "flex-1 sm:flex-initial text-center h-8 flex items-center justify-center rounded-lg px-3 text-xs font-bold transition-all border",
                    isActive
                      ? "bg-amber-500 border-amber-500 text-neutral-950 shadow-sm shadow-amber-500/10"
                      : "bg-neutral-50 border-transparent text-neutral-500 hover:bg-neutral-100 hover:text-neutral-800"
                  )}
                >
                  {sortLabels[option]}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Pure Modular Commercial Grid Container */}
        {storeProducts.length === 0 ? (
          <div className="mt-8 border border-neutral-200 rounded-2xl bg-white p-16 text-center shadow-sm">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Aucun produit dans cette catégorie pour le moment.
            </p>
          </div>
        ) : (
          <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}