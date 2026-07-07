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
    <div className="grid gap-8 md:grid-cols-2">
      {/* Order summary */}
      <div className="order-2 md:order-1">
        <h2 className="mb-3 font-display text-lg font-semibold text-foreground">
          Récapitulatif
        </h2>
        <ul className="divide-y divide-border rounded-lg border border-border">
          {items.map((item) => (
            <li key={item.productId} className="flex items-center gap-3 p-3">
              <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-md bg-secondary">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.name}
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                )}
              </div>
              <div className="flex-1">
                <p className="line-clamp-1 text-sm font-medium text-foreground">
                  {item.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  Qté {item.quantity}
                </p>
              </div>
              <p className="text-sm font-semibold text-foreground">
                {formatPrice(item.price * item.quantity)}
              </p>
            </li>
          ))}
        </ul>
        <div className="mt-3 flex items-center justify-between px-1">
          <p className="font-medium text-foreground">Total</p>
          <p className="font-display text-lg font-semibold text-primary">
            {formatPrice(totalPrice)}
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="order-1 md:order-2">
        <CheckoutForm isLoggedIn={isLoggedIn} />
      </div>
    </div>
  );
}