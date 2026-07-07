import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { ProductCard } from "@/components/store/product-card";
import { Button } from "@/components/ui/button";

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
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-secondary/30">
        <div className="container flex flex-col gap-4 py-10 text-center sm:py-14">
          <h1 className="font-display text-3xl font-semibold leading-tight text-foreground sm:text-4xl">
            Le poutou, tissé dans la tradition
            <br className="hidden sm:block" /> du Fouta-Djallon
          </h1>
          <p className="mx-auto max-w-md text-sm text-muted-foreground sm:text-base">
            Chaque poutou est façonné et teint à la main par des artisans du
            Fouta-Djallon. Découvrez la collection et discutez directement
            avec nous sur WhatsApp.
          </p>
          <div className="mt-2 flex justify-center">
            <Button asChild size="lg">
              <Link href="/products">Voir la collection</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Categories */}
      {categories.length > 0 && (
        <section className="container py-6">
          <div className="flex gap-2 overflow-x-auto pb-1">
            {categories.map((category) => (
              <Link
                key={category.id}
                href={`/products?category=${category.slug}`}
                className="shrink-0 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary"
              >
                {category.name}
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Featured products */}
      <section className="container py-6 pb-12">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-foreground">
            Nouveautés
          </h2>
          <Link
            href="/products"
            className="text-sm font-medium text-primary hover:underline"
          >
            Tout voir
          </Link>
        </div>

        {storeProducts.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
            Aucun produit pour le moment. Revenez bientôt !
          </p>
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