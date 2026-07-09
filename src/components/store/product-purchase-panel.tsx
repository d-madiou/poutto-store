"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Minus, Plus, ShoppingBag, ShieldCheck, Truck, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCart } from "@/lib/cart-context";
import { whatsappLink } from "@/lib/whatsapp";
import type { StoreProduct } from "@/lib/serializers";

export function ProductPurchasePanel({ product }: { product: StoreProduct }) {
  const { addItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const outOfStock = product.stock <= 0;

  function handleAddToCart() {
    addItem(
      {
        productId: product.id,
        name: product.name,
        slug: product.slug,
        price: product.price,
        image: product.images[0] ?? null,
        stock: product.stock,
      },
      quantity
    );
    toast.success(`${product.name} ajouté au panier`, {
      description: `Quantité : ${quantity}`,
    });
  }

  return (
    <div className="w-full bg-white border border-neutral-100 rounded-2xl p-4 sm:p-5 shadow-md space-y-5">
      
      {/* Availability / Stock Status Row */}
      <div className="flex items-center justify-between border-b border-neutral-100 pb-3">
        <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
          Disponibilité
        </span>
        {outOfStock ? (
          <span className="inline-flex items-center rounded-md bg-neutral-100 px-2.5 py-0.5 text-xs font-bold text-neutral-500 uppercase tracking-wide">
            Rupture de stock
          </span>
        ) : product.stock <= 3 ? (
          <span className="inline-flex items-center rounded-md bg-orange-50 px-2.5 py-0.5 text-xs font-black text-orange-600 uppercase tracking-wide animate-pulse">
            Plus que {product.stock} exemplaires !
          </span>
        ) : (
          <span className="inline-flex items-center rounded-md bg-emerald-50 px-2.5 py-0.5 text-xs font-black text-emerald-600 uppercase tracking-wide">
            En Stock
          </span>
        )}
      </div>

      {/* Modern Marketplace Selector Block */}
      {!outOfStock && (
        <div className="flex items-center justify-between bg-neutral-50 rounded-xl p-3 border border-neutral-100">
          <span className="text-xs font-bold uppercase tracking-wider text-neutral-600">
            Quantité
          </span>
          <div className="flex items-center bg-white border border-neutral-200 rounded-lg overflow-hidden shadow-sm">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-20"
              disabled={quantity <= 1}
            >
              <Minus className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
            <span className="w-9 text-center font-sans text-sm font-bold text-neutral-800">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-9 w-9 items-center justify-center text-neutral-500 transition-colors hover:bg-neutral-50 active:bg-neutral-100 disabled:opacity-20"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-3.5 w-3.5 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Retail Heavy Action Button Framework */}
      <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="h-12 flex-1 rounded-xl bg-amber-500 text-neutral-950 text-xs font-black tracking-wider uppercase shadow-md shadow-amber-500/10 transition-all hover:bg-amber-400 active:scale-[0.99] disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
        >
          <ShoppingBag className="mr-2 h-4 w-4 stroke-[2.5]" />
          {outOfStock ? "Épuisé" : "Ajouter au panier"}
        </Button>

        <Button 
          asChild 
          size="lg" 
          className="h-12 flex-1 rounded-xl bg-emerald-600 text-white text-xs font-black tracking-wider uppercase shadow-md shadow-emerald-600/10 transition-all hover:bg-emerald-500 active:scale-[0.99]"
        >
          <a
            href={whatsappLink(product.name, `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/products/${product.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4 stroke-[2.5] fill-current" />
            Discuter sur WhatsApp
          </a>
        </Button>
      </div>

      {/* Trust & Guarantee Cards Feed */}
      <div className="border-t border-neutral-100 pt-4 space-y-3.5">
        <div className="flex items-start gap-3 p-1 rounded-xl hover:bg-neutral-50/50 transition-colors">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 border border-blue-100">
            <Truck className="h-4 w-4 stroke-[2] text-blue-600" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className="font-bold text-neutral-800 text-[11px] uppercase tracking-wide">Livraison Rapide</span>
            <span className="text-xs text-neutral-500 leading-normal">Expédition sécurisée partout en Guinée et à l&apos;international.</span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-1 rounded-xl hover:bg-neutral-50/50 transition-colors">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-purple-50 border border-purple-100">
            <ShieldCheck className="h-4 w-4 stroke-[2] text-purple-600" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className="font-bold text-neutral-800 text-[11px] uppercase tracking-wide">Paiement 100% Sécurisé</span>
            <span className="text-xs text-neutral-500 leading-normal">Orange Money, Mobile Money ou espèces à la livraison.</span>
          </div>
        </div>

        <div className="flex items-start gap-3 p-1 rounded-xl hover:bg-neutral-50/50 transition-colors">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-50 border border-amber-100">
            <RefreshCw className="h-4 w-4 stroke-[2] text-amber-600" />
          </div>
          <div className="flex flex-col space-y-0.5">
            <span className="font-bold text-neutral-800 text-[11px] uppercase tracking-wide">Garantie Artisanale</span>
            <span className="text-xs text-neutral-500 leading-normal">Chaque pièce est authentique, certifiée faite main au Fouta.</span>
          </div>
        </div>
      </div>
    </div>
  );
}