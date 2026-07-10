"use client";

import { ShoppingBag } from "lucide-react";
import { useCart } from "@/lib/cart-context";

export function CartIcon() {
  const { totalItems } = useCart();

  return (
    <>
      <ShoppingBag className="h-5 w-5" />
      {totalItems > 0 && (
        <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground">
          {totalItems > 9 ? "9+" : totalItems}
        </span>
      )}
    </>
  );
}
