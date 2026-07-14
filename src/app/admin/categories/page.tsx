import { prisma } from "@/lib/prisma";
import { CategoryManager } from "@/components/admin/category-manager";

export default async function AdminCategoriesPage() {
  const categories = await prisma.category.findMany({
    orderBy: { name: "asc" },
    include: { _count: { select: { products: true } } },
  });

  return (
    <div className="max-w-lg">
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">
        Catégories
      </h1>
      <CategoryManager categories={categories} />
    </div>
  );
}