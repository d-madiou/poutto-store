import Link from "next/link";
import Image from "next/image";
import { Plus, LayoutGrid } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";
import { ProductRowActions } from "@/components/admin/roduct-row-actions";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: "desc" },
    include: { category: true },
  });

  return (
    <div className="space-y-5 max-w-5xl mx-auto px-4 py-5 md:py-8 pb-24 font-poppins">
      {/* En-tête */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <LayoutGrid className="h-4 w-4" />
          </div>
          <h1 className="text-base font-bold text-gray-900">
            Produits ({products.length})
          </h1>
        </div>
        <Button
          asChild
          size="sm"
          className="h-9 rounded-xl bg-[#E07B39] text-white text-xs font-semibold hover:bg-orange-600 transition-colors px-4"
        >
          <Link href="/admin/products/new" className="flex items-center gap-1.5">
            <Plus className="h-4 w-4" />
            Ajouter
          </Link>
        </Button>
      </div>

      {/* Liste produits */}
      {products.length === 0 ? (
        <div className="border border-dashed border-gray-300 rounded-xl bg-gray-50 p-12 text-center">
          <p className="text-sm font-medium text-gray-500">
            Aucun produit pour le moment.
          </p>
        </div>
      ) : (
        <ul className="border border-gray-200 bg-white rounded-xl divide-y divide-gray-100 overflow-hidden">
          {products.map((product) => {
            const isArchived = product.status === "ARCHIVED";
            const isLowStock = product.stock <= 3 && product.status === "ACTIVE";
            const isOutOfStock = product.stock <= 0 && product.status === "ACTIVE";

            return (
              <li
                key={product.id}
                className="flex items-center gap-3 p-3 active:bg-gray-50 transition-colors"
              >
                {/* Image miniature */}
                <div className="relative h-12 w-12 shrink-0 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center text-[9px] font-semibold text-gray-400">
                      –
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="truncate text-sm font-semibold text-gray-800">
                      {product.name}
                    </p>
                    {isArchived && (
                      <span className="inline-block rounded-full bg-gray-100 text-gray-600 px-2 py-0.5 text-[10px] font-semibold">
                        Archivé
                      </span>
                    )}
                    {isOutOfStock && (
                      <span className="inline-block rounded-full bg-red-50 text-red-600 px-2 py-0.5 text-[10px] font-semibold">
                        Rupture
                      </span>
                    )}
                    {isLowStock && (
                      <span className="inline-block rounded-full bg-[#E07B39]/10 text-[#E07B39] px-2 py-0.5 text-[10px] font-semibold">
                        Stock: {product.stock}
                      </span>
                    )}
                    {product.stock > 3 && product.status === "ACTIVE" && (
                      <span className="inline-block rounded-full bg-emerald-50 text-emerald-600 px-2 py-0.5 text-[10px] font-semibold">
                        Stock: {product.stock}
                      </span>
                    )}
                  </div>
                  <p className="mt-0.5 text-xs text-gray-500">
                    {product.category.name} · <span className="font-semibold text-gray-900">{formatPrice(Number(product.price))}</span>
                  </p>
                </div>

                {/* Actions */}
                <div className="shrink-0">
                  <ProductRowActions
                    productId={product.id}
                    status={product.status}
                  />
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}