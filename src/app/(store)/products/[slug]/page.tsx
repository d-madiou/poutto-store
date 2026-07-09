import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { formatPrice } from "@/lib/format";
import { Badge } from "@/components/ui/badge";
import { ProductPurchasePanel } from "@/components/store/product-purchase-panel";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const storeProduct = serializeProduct(product);
  const attributes = [
      {
        label: "Tailles",
        value: storeProduct.sizes.length > 0 ? storeProduct.sizes.join(", ") : null,
      },
      { label: "Couleur", value: storeProduct.color },
      { label: "Région", value: storeProduct.region },
    ].filter((a) => a.value);

  return (
    <div className="container py-6 pb-16">
      <div className="grid gap-6 md:grid-cols-2 md:gap-10">
        {/* Image gallery */}
        <div className="space-y-2">
          <div className="relative aspect-square w-full overflow-hidden rounded-lg bg-secondary">
            {storeProduct.images[0] ? (
              <Image
                src={storeProduct.images[0]}
                alt={storeProduct.name}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                priority
                className="object-cover"
              />
            ) : (
              <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
                Pas d&apos;image
              </div>
            )}
          </div>

          {storeProduct.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {storeProduct.images.slice(1).map((img, i) => (
                <div
                  key={img + i}
                  className="relative aspect-square overflow-hidden rounded-md bg-secondary"
                >
                  <Image
                    src={img}
                    alt={`${storeProduct.name} — image ${i + 2}`}
                    fill
                    sizes="25vw"
                    className="object-cover"
                  />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-4">
          {storeProduct.category && (
            <Badge variant="secondary">{storeProduct.category.name}</Badge>
          )}

          <h1 className="font-display text-2xl font-semibold text-foreground sm:text-3xl">
            {storeProduct.name}
          </h1>

          <p className="font-display text-2xl font-semibold text-primary">
            {formatPrice(storeProduct.price)}
          </p>

          {storeProduct.stock <= 0 && (
            <Badge variant="destructive">Épuisé</Badge>
          )}
          {storeProduct.stock > 0 && storeProduct.stock <= 3 && (
            <p className="text-sm font-medium text-accent">
              Plus que {storeProduct.stock} en stock
            </p>
          )}

          <p className="whitespace-pre-line text-sm leading-relaxed text-muted-foreground">
            {storeProduct.description}
          </p>

          {attributes.length > 0 && (
            <dl className="grid grid-cols-2 gap-x-4 gap-y-2 rounded-lg border border-border bg-card p-4 text-sm">
              {attributes.map((attr) => (
                <div key={attr.label}>
                  <dt className="text-muted-foreground">{attr.label}</dt>
                  <dd className="font-medium text-foreground">{attr.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <ProductPurchasePanel product={storeProduct} />
        </div>
      </div>
    </div>
  );
}