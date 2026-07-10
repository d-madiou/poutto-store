import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { ProductCard } from "@/components/store/product-card";
import { cn } from "@/lib/utils";
import Link from "next/link";

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
    <div className="bg-white min-h-screen pb-24 font-poppins">
      <div className="container max-w-7xl mx-auto px-4 py-5 md:px-6 md:py-6">
        {/* Titre + compteur, propre et direct */}
        <div className="flex items-center justify-between mb-5">
          <div className="flex items-baseline gap-1">
            <h1 className="text-lg font-bold text-gray-900 tracking-tight">
              Collection
            </h1>
            <span className="text-xs font-medium text-gray-400 ml-1">
              {storeProducts.length} article{storeProducts.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        {/* Filtres catégories — style mobile-first, scroll horizontal */}
        <div className="mb-4">
          <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-none -mx-4 px-4 sm:mx-0 sm:px-0">
            <Link
              href="/products"
              className={cn(
                "shrink-0 h-10 flex items-center justify-center rounded-full px-4 text-xs font-semibold transition-colors border",
                !activeCategory
                  ? "bg-[#E07B39] border-[#E07B39] text-white"
                  : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900"
              )}
            >
              Tous
            </Link>
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className={cn(
                  "shrink-0 h-10 flex items-center justify-center rounded-full px-4 text-xs font-semibold transition-colors border",
                  activeCategory === category.slug
                    ? "bg-[#E07B39] border-[#E07B39] text-white"
                    : "bg-white border-gray-200 text-gray-700 hover:border-gray-300 hover:text-gray-900"
                )}
              >
                {category.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Tri — compact et lisible */}
        <div className="flex items-center gap-3 mb-6 flex-wrap">
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            Trier
          </span>
          <div className="flex gap-1.5">
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
                    "h-9 flex items-center justify-center rounded-full px-3 text-xs font-semibold transition-colors border",
                    isActive
                      ? "bg-[#E07B39] border-[#E07B39] text-white"
                      : "bg-gray-50 border-gray-100 text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                  )}
                >
                  {sortLabels[option]}
                </Link>
              );
            })}
          </div>
        </div>

        {/* Grille produits */}
        {storeProducts.length === 0 ? (
          <div className="mt-8 border border-gray-200 rounded-2xl bg-white p-12 text-center">
            <p className="text-sm font-medium text-gray-500">
              Aucun produit pour le moment.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
            {storeProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}