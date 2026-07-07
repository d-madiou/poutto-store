"use client";

import { useState } from "react";
import { toast } from "sonner";
import { MessageCircle, Minus, Plus, ShoppingBag } from "lucide-react";
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
    <div className="space-y-4">
      {!outOfStock && (
        <div className="flex items-center gap-3">
          <span className="text-sm font-medium text-foreground">Quantité</span>
          <div className="flex items-center rounded-md border border-input">
            <button
              type="button"
              aria-label="Diminuer la quantité"
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="flex h-11 w-11 items-center justify-center text-foreground disabled:opacity-40"
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </button>
            <span className="w-8 text-center text-sm font-medium">{quantity}</span>
            <button
              type="button"
              aria-label="Augmenter la quantité"
              onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
              className="flex h-11 w-11 items-center justify-center text-foreground disabled:opacity-40"
              disabled={quantity >= product.stock}
            >
              <Plus className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}

      <div className="grid gap-2 sm:grid-cols-2">
        <Button
          size="lg"
          disabled={outOfStock}
          onClick={handleAddToCart}
          className="h-12"
        >
          <ShoppingBag className="h-5 w-5" />
          {outOfStock ? "Épuisé" : "Ajouter au panier"}
        </Button>

        <Button asChild size="lg" variant="accent" className="h-12">
          {/* Fixed the missing "<a" tag below */}
          <a
            href={whatsappLink(product.name, `${process.env.NEXT_PUBLIC_SITE_URL ?? ""}/products/${product.slug}`)}
            target="_blank"
            rel="noopener noreferrer"
          >
            <MessageCircle className="h-5 w-5" />
            Discuter sur WhatsApp
          </a>
        </Button>
      </div>
    </div>
  );
}