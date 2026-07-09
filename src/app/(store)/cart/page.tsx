"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="container max-w-xl mx-auto flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-neutral-100 text-neutral-400">
          <ShoppingCart className="h-8 w-8" />
        </div>
        <h1 className="text-lg font-black text-neutral-900 uppercase tracking-wide">
          Votre panier est vide
        </h1>
        <p className="text-xs text-neutral-500 max-w-xs leading-normal">
          Découvrez nos collections de bonnets artisanaux et trouvez votre prochain coup de cœur.
        </p>
        <Button asChild size="lg" className="mt-2 h-11 rounded-xl bg-amber-500 font-black text-xs uppercase tracking-wider text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/10">
          <Link href="/products">Voir la collection</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-neutral-50/50 min-h-screen pb-32">
      <div className="container max-w-3xl mx-auto px-4 py-6 md:py-8">
        
        {/* Marketplace Title Header Module */}
        <div className="flex items-center gap-2 border-b border-neutral-200/80 pb-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-amber-500/10 text-amber-600">
            <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
          </div>
          <h1 className="text-sm font-black uppercase tracking-wider text-neutral-900">
            Mon Panier ({items.length})
          </h1>
        </div>

        {/* Clean Line-Item Feed */}
        <ul className="mt-4 bg-white border border-neutral-200/60 rounded-2xl shadow-sm divide-y divide-neutral-100 overflow-hidden">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 p-4 hover:bg-neutral-50/30 transition-colors">
              
              {/* Product Thumbnail Frame */}
              <Link
                href={`/products/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 flex items-center justify-center"
              >
                {item.image ? (
                  <div className="relative h-full w-full p-2">
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <div className="text-[9px] font-bold text-neutral-400 uppercase">Vide</div>
                )}
              </Link>

              {/* Specs & Modification Interactivity Area */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 text-xs font-bold leading-snug text-neutral-800 hover:text-amber-600 transition-colors"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Retirer ${item.name} du panier`}
                    onClick={() => removeItem(item.productId)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-neutral-100 text-neutral-400 hover:text-red-500 hover:bg-red-50 hover:border-red-100 transition-all"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  
                  {/* Modern Stepper Selector Block */}
                  <div className="flex items-center bg-neutral-50 border border-neutral-200 rounded-lg overflow-hidden shadow-xs">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity - 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-20"
                    >
                      <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-8 text-center font-sans text-xs font-black text-neutral-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() =>
                        updateQuantity(item.productId, item.quantity + 1)
                      }
                      className="flex h-8 w-8 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-100 active:bg-neutral-200 disabled:opacity-20"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Calculated Price Display */}
                  <p className="font-sans text-sm font-black text-neutral-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>

      </div>

      {/* Sticky High-Conversion Marketplace Action Checkout Dock */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-neutral-200 bg-white/95 backdrop-blur-md shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
        <div className="container max-w-3xl mx-auto flex items-center justify-between gap-6 px-4 py-4">
          <div>
            <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wider">Total à payer</p>
            <p className="font-sans text-lg font-black text-neutral-900">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <Button asChild size="lg" className="h-12 flex-1 sm:max-w-[240px] rounded-xl bg-amber-500 font-black text-xs uppercase tracking-wider text-neutral-950 hover:bg-amber-400 shadow-md shadow-amber-500/20 transition-all hover:scale-[1.01] active:scale-[0.99]">
            <Link href="/checkout">Passer commande</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}