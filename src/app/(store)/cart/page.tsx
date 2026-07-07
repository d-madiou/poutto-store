"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container flex flex-col items-center gap-4 py-16 text-center">
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Votre panier est vide
        </h1>
        <p className="text-sm text-muted-foreground">
          Parcourez notre collection pour trouver votre prochain poutou.
        </p>
        <Button asChild size="lg">
          <Link href="/products">Voir la collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container py-6 pb-24">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Votre panier
      </h1>

      <ul className="mt-4 divide-y divide-border">
        {items.map((item) => (
          <li key={item.productId} className="flex gap-3 py-4">
            <Link
              href={`/products/${item.slug}`}
              className="relative h-20 w-20 shrink-0 overflow-hidden rounded-md bg-secondary"
            >
              {item.image ? (
                <Image
                  src={item.image}
                  alt={item.name}
                  fill
                  sizes="80px"
                  className="object-cover"
                />
              ) : null}
            </Link>

            <div className="flex flex-1 flex-col justify-between">
              <div className="flex items-start justify-between gap-2">
                <Link
                  href={`/products/${item.slug}`}
                  className="line-clamp-2 text-sm font-medium text-foreground"
                >
                  {item.name}
                </Link>
                <button
                  type="button"
                  aria-label={`Retirer ${item.name} du panier`}
                  onClick={() => removeItem(item.productId)}
                  className="flex h-9 w-9 shrink-0 items-center justify-center text-muted-foreground hover:text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center rounded-md border border-input">
                  <button
                    type="button"
                    aria-label="Diminuer la quantité"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity - 1)
                    }
                    className="flex h-9 w-9 items-center justify-center text-foreground"
                  >
                    <Minus className="h-3.5 w-3.5" />
                  </button>
                  <span className="w-6 text-center text-sm font-medium">
                    {item.quantity}
                  </span>
                  <button
                    type="button"
                    aria-label="Augmenter la quantité"
                    onClick={() =>
                      updateQuantity(item.productId, item.quantity + 1)
                    }
                    className="flex h-9 w-9 items-center justify-center text-foreground disabled:opacity-40"
                    disabled={item.quantity >= item.stock}
                  >
                    <Plus className="h-3.5 w-3.5" />
                  </button>
                </div>

                <p className="font-display text-sm font-semibold text-primary">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {/* Sticky total + checkout bar */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-border bg-background/95 backdrop-blur">
        <div className="container flex items-center justify-between gap-4 py-3">
          <div>
            <p className="text-xs text-muted-foreground">Total</p>
            <p className="font-display text-lg font-semibold text-foreground">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <Button asChild size="lg" className="h-12 flex-1 sm:flex-none">
            <Link href="/checkout">Passer commande</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}