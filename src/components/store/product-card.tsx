import Image from "next/image";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/serializers";

export function ProductCard({ product }: { product: StoreProduct }) {
  const outOfStock = product.stock <= 0;
  const image = product.images[0];

  return (
    <Link
      href={`/products/${product.slug}`}
      className="group block overflow-hidden rounded-lg border border-border bg-card transition-shadow hover:shadow-md"
    >
      <div className="relative aspect-square w-full overflow-hidden bg-secondary">
        {image ? (
          <Image
            src={image}
            alt={product.name}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-muted-foreground">
            Pas d&apos;image
          </div>
        )}

        {outOfStock && (
          <Badge
            variant="destructive"
            className="absolute left-2 top-2"
          >
            Épuisé
          </Badge>
        )}

        {product.region && (
          <Badge
            variant="secondary"
            className="absolute right-2 top-2 bg-background/90"
          >
            {product.region}
          </Badge>
        )}
      </div>

      <div className="space-y-1 p-3">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug text-foreground">
          {product.name}
        </h3>
        <p className="font-display text-base font-semibold text-primary">
          {formatPrice(product.price)}
        </p>
      </div>
    </Link>
  );
}