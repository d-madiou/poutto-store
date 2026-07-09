import Link from "next/link";
import Image from "next/image";
import { Plus, LayoutGrid, PackageCheck } from "lucide-react";
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
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-4 md:py-8 pb-24">
      {/* Top Header Module */}
      <div className="flex items-center justify-between border-b border-border/60 pb-3">
        <div className="flex items-center gap-2">
          <LayoutGrid className="h-4 w-4 text-muted-foreground stroke-[2]" />
          <h1 className="font-sans text-xs font-black uppercase tracking-widest text-foreground">
            Catalogue Produits ({products.length})
          </h1>
        </div>
        <Button 
          asChild 
          size="sm"
          className="h-8 rounded-none bg-primary text-xs font-bold uppercase tracking-wider px-3"
        >
          <Link href="/admin/products/new" className="flex items-center gap-1.5">
            <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            Ajouter
          </Link>
        </Button>
      </div>

      {/* Product Feed Content */}
      {products.length === 0 ? (
        <div className="border border-dashed border-border bg-secondary/10 p-12 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Aucun produit répertorié dans votre base de données.
          </p>
        </div>
      ) : (
        <ul className="divide-y divide-border/60 border border-border bg-card rounded-none">
          {products.map((product) => {
            const isArchived = product.status === "ARCHIVED";
            const isLowStock = product.stock <= 3 && product.status === "ACTIVE";
            const isOutOfStock = product.stock <= 0 && product.status === "ACTIVE";

            return (
              <li 
                key={product.id} 
                className="group flex items-center justify-between gap-4 p-3 hover:bg-secondary/20 transition-colors"
              >
                {/* Fixed Thumbnail Frame Container */}
                <div className="relative h-12 w-12 shrink-0 border border-border bg-white p-1">
                  {product.images[0] ? (
                    <Image
                      src={product.images[0]}
                      alt={product.name}
                      fill
                      sizes="48px"
                      className="object-contain"
                    />
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-secondary text-[8px] font-bold text-muted-foreground uppercase">
                      Vide
                    </div>
                  )}
                </div>

                {/* Metadata Column Block */}
                <div className="min-w-0 flex-1 space-y-0.5">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <p className="truncate text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                      {product.name}
                    </p>
                    
                    {/* Status Labels */}
                    {isArchived && (
                      <span className="inline-block border border-border bg-secondary/60 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-muted-foreground">
                        Archivé
                      </span>
                    )}
                    
                    {isOutOfStock ? (
                      <span className="inline-block border border-destructive/20 bg-destructive/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-destructive">
                        Rupture
                      </span>
                    ) : isLowStock ? (
                      <span className="inline-block border border-brass/20 bg-brass/10 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-brass">
                        Alerte Stock: {product.stock}
                      </span>
                    ) : (
                      product.status === "ACTIVE" && (
                        <span className="inline-block border border-emerald-200 bg-emerald-50 px-1.5 py-0.5 text-[8px] font-black uppercase tracking-wider text-emerald-700">
                          Stock: {product.stock}
                        </span>
                      )
                    )}
                  </div>

                  <p className="font-mono text-[11px] text-muted-foreground font-medium">
                    {product.category.name} <span className="text-border mx-1">·</span> <span className="text-foreground font-bold">{formatPrice(Number(product.price))}</span>
                  </p>
                </div>

                {/* Dropdown Action Node */}
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