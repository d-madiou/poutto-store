"use client";

import { useState, useTransition } from "react";
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
        status === "ACTIVE" ? "Produit archivé" : "Produit restauré"
      );
    });
  }

  return (
    <div className="flex shrink-0 items-center gap-1">
      <Link
        href={`/admin/products/${productId}/edit`}
        aria-label="Modifier"
        className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
      >
        <Pencil className="h-4 w-4" />
      </Link>
      <button
        type="button"
        aria-label={status === "ACTIVE" ? "Archiver" : "Restaurer"}
        onClick={handleToggleArchive}
        disabled={isPending}
        className="flex h-10 w-10 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40"
      >
        {status === "ACTIVE" ? (
          <Archive className="h-4 w-4" />
        ) : (
          <ArchiveRestore className="h-4 w-4" />
        )}
      </button>
    </div>
  );
}