import { prisma } from "@/lib/prisma";
import { ProductForm } from "@/components/admin/product-form";

export default async function NewProductPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
  });

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">
        Nouveau produit
      </h1>
      <ProductForm categories={categories} />
    </div>
  );
}