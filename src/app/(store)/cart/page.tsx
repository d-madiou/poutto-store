"use client";

import Image from "next/image";
import Link from "next/link";
import { ArrowLeft, Minus, Plus, Trash2, ShoppingBag, ShoppingCart } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { Button } from "@/components/ui/button";

export default function CartPage() {
  const { items, updateQuantity, removeItem, totalPrice } = useCart();

  if (items.length === 0) {
    return (
      <div className="min-h-screen bg-white font-poppins flex flex-col">
        {/* Barre de retour */}
        <div className="px-4 py-4">
          <Link href="/products" className="inline-flex items-center gap-1.5 text-gray-500 hover:text-gray-800 transition-colors">
            <ArrowLeft className="h-4 w-4" />
            <span className="text-xs font-semibold uppercase tracking-wider">Retour</span>
          </Link>
        </div>
        <div className="container max-w-xl mx-auto flex flex-col items-center justify-center gap-4 py-20 px-4 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 text-gray-400">
            <ShoppingCart className="h-8 w-8" />
          </div>
          <h1 className="text-lg font-bold text-gray-900 uppercase tracking-wide">
            Votre panier est vide
          </h1>
          <p className="text-sm text-gray-500 max-w-xs leading-normal">
            Découvrez nos collections de bonnets artisanaux.
          </p>
          <Button asChild size="lg" className="mt-2 h-11 rounded-xl bg-[#E07B39] text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
            <Link href="/products">Voir la collection</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen pb-32 font-poppins">
      <div className="container max-w-3xl mx-auto px-4 py-5">
        
        {/* Barre de retour + titre */}
        <div className="flex items-center gap-3 mb-5">
          <Link href="/products" className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-200 text-gray-500 hover:text-gray-800 hover:border-gray-300 transition-colors">
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <h1 className="text-base font-bold text-gray-900">
            Mon panier ({items.length})
          </h1>
        </div>

        {/* Liste des articles */}
        <ul className="bg-white border border-gray-200 rounded-2xl divide-y divide-gray-100 overflow-hidden">
          {items.map((item) => (
            <li key={item.productId} className="flex gap-4 p-4">
              
              {/* Miniature */}
              <Link
                href={`/products/${item.slug}`}
                className="relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border border-gray-200 bg-gray-50 flex items-center justify-center"
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
                  <div className="text-[9px] font-semibold text-gray-400">–</div>
                )}
              </Link>

              {/* Infos + actions */}
              <div className="flex flex-1 flex-col justify-between min-w-0">
                <div className="flex items-start justify-between gap-3">
                  <Link
                    href={`/products/${item.slug}`}
                    className="line-clamp-2 text-sm font-semibold leading-snug text-gray-800 hover:text-[#E07B39] transition-colors"
                  >
                    {item.name}
                  </Link>
                  <button
                    type="button"
                    aria-label={`Retirer ${item.name} du panier`}
                    onClick={() => removeItem(item.productId)}
                    className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border border-gray-200 text-gray-400 hover:text-red-500 hover:border-red-200 transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>

                <div className="mt-2 flex items-center justify-between gap-2">
                  
                  {/* Stepper quantité */}
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
                    <button
                      type="button"
                      aria-label="Diminuer la quantité"
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-20"
                    >
                      <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-gray-800">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      aria-label="Augmenter la quantité"
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="flex h-8 w-8 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-20"
                      disabled={item.quantity >= item.stock}
                    >
                      <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
                    </button>
                  </div>

                  {/* Prix */}
                  <p className="text-sm font-bold text-gray-900">
                    {formatPrice(item.price * item.quantity)}
                  </p>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Barre sticky bas */}
      <div className="fixed inset-x-0 bottom-0 z-30 border-t border-gray-200 bg-white">
        <div className="container max-w-3xl mx-auto flex items-center justify-between gap-6 px-4 py-4">
          <div>
            <p className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Total</p>
            <p className="text-lg font-bold text-gray-900">
              {formatPrice(totalPrice)}
            </p>
          </div>
          <Button asChild size="lg" className="h-12 flex-1 sm:max-w-[240px] rounded-xl bg-[#E07B39] text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
            <Link href="/checkout">Passer commande</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}