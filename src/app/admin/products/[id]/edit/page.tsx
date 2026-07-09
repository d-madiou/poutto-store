import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function EditProductPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const [product, categories] = await Promise.all([
    prisma.product.findUnique({ where: { id } }),
    prisma.category.findMany({ orderBy: { name: "asc" } }),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">
        Modifier le produit
      </h1>
      <ProductForm
        categories={categories}
        product={{
          id: product.id,
          name: product.name,
          slug: product.slug,
          description: product.description,
          price: Number(product.price),
          stock: product.stock,
          images: product.images,
          sizes: product.sizes,
          color: product.color,
          region: product.region,
          categoryId: product.categoryId,
        }}
      />
    </div>
  );
}