"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { CheckoutForm } from "@/components/store/checkout-form";

export function CheckoutClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { items, totalPrice } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start lg:gap-10">
      
      {/* Checkout Form Box (First on mobile, left on desktop) */}
      <div className="order-1 md:col-span-7 lg:col-span-8">
        <div className="border border-border bg-card p-4 sm:p-6">
          <CheckoutForm isLoggedIn={isLoggedIn} />
        </div>
      </div>

      {/* Order Summary Sidebar (Second on mobile, sticky/contained right on desktop) */}
      <div className="order-2 md:sticky md:top-24 md:col-span-5 lg:col-span-4">
        <div className="border border-border bg-secondary/10 p-4">
          <h2 className="mb-4 font-sans text-xs font-black uppercase tracking-widest text-foreground">
            Votre Commande
          </h2>
          
          {/* Strict Item Linefeed */}
          <ul className="divide-y divide-border/60 border-b border-border/60">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3 py-3 first:pt-0">
                
                {/* Fixed product thumbnail grid container to pull out zoom issues */}
                <div className="relative h-12 w-12 shrink-0 border border-border bg-white p-1">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
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

                {/* Meta Description layout block */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-bold text-foreground">
                    {item.name}
                  </p>
                  <p className="mt-0.5 font-sans text-[11px] text-muted-foreground font-medium">
                    Quantité : {item.quantity}
                  </p>
                </div>

                {/* Line Item Pricing Display */}
                <p className="text-xs font-black text-foreground">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          {/* Pricing Summary Block Box */}
          <div className="mt-4 space-y-2">
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Sous-total</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-xs font-medium text-muted-foreground">
              <span>Livraison</span>
              <span className="font-bold text-emerald-600 uppercase text-[10px] tracking-wider bg-emerald-50 px-1.5 py-0.5 rounded-sm">
                Calculé à l'étape suivante
              </span>
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-border pt-4">
              <p className="text-xs font-black uppercase tracking-wider text-foreground">
                Total à régler
              </p>
              <p className="text-base font-black tracking-tight text-primary">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}