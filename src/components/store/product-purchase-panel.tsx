"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Minus, Plus, ShoppingBag, Truck, ShieldCheck, RefreshCw } from "lucide-react";
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
    <div className="w-full bg-white border border-gray-200 rounded-2xl p-5 font-poppins space-y-5">
      
      {/* Disponibilité */}
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
          Disponibilité
        </span>
        {outOfStock ? (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-semibold text-gray-600">
            Rupture
          </span>
        ) : product.stock <= 3 ? (
          <span className="inline-flex items-center rounded-full bg-[#E07B39]/10 px-3 py-0.5 text-xs font-semibold text-[#E07B39]">
            {product.stock} restant{product.stock > 1 ? "s" : ""}
          </span>
        ) : (
          <span className="inline-flex items-center rounded-full bg-gray-100 px-3 py-0.5 text-xs font-semibold text-gray-700">
            En stock
          </span>
        )}
      </div>

      {/* Quantité (si en stock) */}
      {!outOfStock && (
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">
            Quantité
          </span>
          <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-9 w-9 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-20"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4 stroke-[2.5]" />
            </button>
            <span className="w-9 text-center text-sm font-semibold text-gray-800">
              {quantity}
            </span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-9 w-9 items-center justify-center text-gray-500 transition-colors hover:bg-gray-50 active:bg-gray-100 disabled:opacity-20"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4 stroke-[2.5]" />
            </button>
          </div>
        </div>
      )}

      {/* Boutons d'action — une seule ligne sur mobile, WhatsApp icône seule */}
      <div className="flex items-center gap-3">
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="h-12 flex-1 rounded-xl bg-[#E07B39] text-white text-sm font-semibold tracking-wide transition-colors hover:bg-orange-600 active:bg-[#c96c2e] disabled:bg-gray-100 disabled:text-gray-400"
        >
          <ShoppingBag className="mr-2 h-4 w-4 stroke-[2.5]" />
          {outOfStock ? "Épuisé" : "Ajouter au panier"}
        </Button>

        <Button
          asChild
          size="lg"
          className="h-12 w-12 rounded-xl bg-emerald-600 text-white transition-colors hover:bg-emerald-500 active:bg-emerald-700 sm:w-auto sm:px-6"
        >
          <a
            href={whatsappLink(product.name, `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/products/${product.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2"
          >
            <MessageCircle className="h-4 w-4 fill-current" />
            <span className="hidden sm:inline text-sm font-semibold tracking-wide">WhatsApp</span>
          </a>
        </Button>
      </div>

      {/* Réassurance */}
      <div className="border-t border-gray-100 pt-4 space-y-3">
        <div className="flex items-start gap-2.5">
          <Truck className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-gray-800">Livraison rapide</p>
            <p className="text-gray-500 leading-snug mt-0.5">Expédition partout en Guinée et à l&apos;international.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <ShieldCheck className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-gray-800">Paiement sécurisé</p>
            <p className="text-gray-500 leading-snug mt-0.5">Orange Money, Mobile Money ou espèces à la livraison.</p>
          </div>
        </div>
        <div className="flex items-start gap-2.5">
          <RefreshCw className="h-4 w-4 text-gray-400 mt-0.5 shrink-0" />
          <div className="text-xs">
            <p className="font-semibold text-gray-800">Garantie artisanale</p>
            <p className="text-gray-500 leading-snug mt-0.5">Authenticité et confection main certifiées Fouta-Djallon.</p>
          </div>
        </div>
      </div>
    </div>
  );
}