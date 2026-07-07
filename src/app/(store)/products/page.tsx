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
    <div className="container py-6 pb-16">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Notre collection
      </h1>

      {/* Category filter pills */}
      <div className="mt-4 flex gap-2 overflow-x-auto pb-1">
        <Link
          href="/products"
          className={cn(
            "shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
            !activeCategory
              ? "bg-primary text-primary-foreground"
              : "bg-card text-foreground hover:bg-secondary"
          )}
        >
          Tout
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/products?category=${category.slug}`}
            className={cn(
              "shrink-0 rounded-full border border-border px-4 py-2 text-sm font-medium transition-colors",
              activeCategory === category.slug
                ? "bg-primary text-primary-foreground"
                : "bg-card text-foreground hover:bg-secondary"
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {/* Sort */}
      <div className="mt-4 flex items-center justify-between">
        <p className="text-sm text-muted-foreground">
          {storeProducts.length} article{storeProducts.length > 1 ? "s" : ""}
        </p>
        <div className="flex gap-1">
          {(Object.keys(sortLabels) as SortOption[]).map((option) => {
            const qs = new URLSearchParams();
            if (activeCategory) qs.set("category", activeCategory);
            qs.set("sort", option);
            return (
              <Link
                key={option}
                href={`/products?${qs.toString()}`}
                className={cn(
                  "rounded-md px-2.5 py-1.5 text-xs font-medium transition-colors",
                  sort === option
                    ? "bg-secondary text-foreground"
                    : "text-muted-foreground hover:bg-secondary/60"
                )}
              >
                {sortLabels[option]}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Grid */}
      {storeProducts.length === 0 ? (
        <p className="mt-10 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucun produit dans cette catégorie pour le moment.
        </p>
      ) : (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4">
          {storeProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
}