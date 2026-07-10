"use client";

import { useTransition } from "react";
import Link from "next/link";
import { toast } from "sonner";
import { Pencil, Archive, ArchiveRestore } from "lucide-react";
import { archiveProduct, restoreProduct } from "@/actions/product";

export function ProductRowActions({
  productId,
  status,
}: {
  productId: string;
  status: string;
}) {
  const [isPending, startTransition] = useTransition();

  function handleToggleArchive() {
    const action = status === "ACTIVE" ? archiveProduct : restoreProduct;
    startTransition(async () => {
      const result = await action(productId);
      if (!result.success) {
        toast.error(result.error);
        return;
      }
      toast.success(
        status === "ACTIVE"
          ? "Produit archivé"
          : "Produit restauré"
      );
    });
  }

  const isArchived = status !== "ACTIVE";

  return (
    <div className="flex items-center gap-1.5">
      {/* Modifier */}
      <Link
        href={`/admin/products/${productId}/edit`}
        aria-label="Modifier le produit"
        className="flex h-9 w-9 items-center justify-center rounded-lg border border-gray-200 bg-white text-gray-600 transition-colors hover:border-gray-300 hover:text-gray-900 active:bg-gray-50"
      >
        <Pencil className="h-4 w-4" />
      </Link>

      {/* Archiver / Restaurer */}
      <button
        type="button"
        aria-label={isArchived ? "Restaurer le produit" : "Archiver le produit"}
        onClick={handleToggleArchive}
        disabled={isPending}
        className={`flex h-9 w-9 items-center justify-center rounded-lg border transition-colors disabled:opacity-50 disabled:pointer-events-none ${
          isArchived
            ? "border-emerald-600 bg-emerald-600 text-white hover:bg-emerald-500"
            : "border-gray-200 bg-white text-red-600 hover:bg-red-50 hover:border-red-200"
        }`}
      >
        {isArchived ? (
          <ArchiveRestore className="h-4 w-4" />
        ) : (
          <Archive className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}