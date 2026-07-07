import type { Category, Product } from "@prisma/client";

/**
 * Les `Decimal` Prisma ne traversent pas la frontière Server → Client Components.
 * On convertit systématiquement `price` en `number` avant de passer un produit
 * à un composant client.
 */
export type StoreProduct = Omit<Product, "price" | "createdAt" | "updatedAt"> & {
  price: number;
  createdAt: string;
  updatedAt: string;
  category?: Pick<Category, "id" | "name" | "slug">;
};

export function serializeProduct(
  product: Product & { category?: Category }
): StoreProduct {
  return {
    ...product,
    price: Number(product.price),
    createdAt: product.createdAt.toISOString(),
    updatedAt: product.updatedAt.toISOString(),
    category: product.category
      ? { id: product.category.id, name: product.category.name, slug: product.category.slug }
      : undefined,
  };
}
