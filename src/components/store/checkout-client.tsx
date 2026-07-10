"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { useCart } from "@/lib/cart-context";
import { formatPrice } from "@/lib/format";
import { CheckoutForm } from "@/components/store/checkout-form";
import { ShoppingBag } from "lucide-react";

export function CheckoutClient({ isLoggedIn }: { isLoggedIn: boolean }) {
  const { items, totalPrice } = useCart();
  const router = useRouter();

  useEffect(() => {
    if (items.length === 0) router.replace("/cart");
  }, [items.length, router]);

  if (items.length === 0) return null;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-12 md:items-start lg:gap-8 font-poppins">
      
      {/* Formulaire de commande */}
      <div className="order-1 md:col-span-7 lg:col-span-8">
        <div className="rounded-2xl border border-gray-200 bg-white p-5 sm:p-6">
          <CheckoutForm isLoggedIn={isLoggedIn} />
        </div>
      </div>

      {/* Résumé de la commande (sticky sur desktop) */}
      <div className="order-2 md:sticky md:top-24 md:col-span-5 lg:col-span-4">
        <div className="rounded-2xl border border-gray-200 bg-white p-5">
          
          {/* En-tête */}
          <div className="mb-4 flex items-center gap-2 border-b border-gray-100 pb-3">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-600">
              <ShoppingBag className="h-3.5 w-3.5 stroke-[2.5]" />
            </div>
            <h2 className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Votre commande
            </h2>
          </div>
          
          {/* Liste des articles */}
          <ul className="divide-y divide-gray-100 max-h-[280px] overflow-y-auto pr-1">
            {items.map((item) => (
              <li key={item.productId} className="flex items-center gap-3.5 py-3 first:pt-0">
                
                {/* Miniature */}
                <div className="relative h-14 w-14 shrink-0 rounded-lg border border-gray-200 bg-gray-50 flex items-center justify-center overflow-hidden">
                  {item.image ? (
                    <Image
                      src={item.image}
                      alt={item.name}
                      fill
                      sizes="56px"
                      className="object-contain p-1"
                    />
                  ) : (
                    <div className="text-[9px] font-semibold text-gray-400 uppercase">
                      –
                    </div>
                  )}
                </div>

                {/* Infos */}
                <div className="flex-1 min-w-0">
                  <p className="truncate text-xs font-semibold text-gray-800">
                    {item.name}
                  </p>
                  <p className="mt-0.5 text-[11px] font-medium text-gray-500">
                    Qté : {item.quantity}
                  </p>
                </div>

                {/* Prix */}
                <p className="text-xs font-bold text-gray-900 shrink-0">
                  {formatPrice(item.price * item.quantity)}
                </p>
              </li>
            ))}
          </ul>

          {/* Totaux */}
          <div className="mt-4 border-t border-gray-100 pt-4 space-y-2.5">
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>Sous-total</span>
              <span className="font-semibold text-gray-800">{formatPrice(totalPrice)}</span>
            </div>
            
            <div className="flex items-center justify-between text-xs font-medium text-gray-500">
              <span>Livraison</span>
              <span className="text-gray-400 text-[11px]">
                Calculée à l&apos;étape suivante
              </span>
            </div>
            
            <div className="mt-4 flex items-center justify-between border-t border-gray-100 pt-4">
              <p className="text-xs font-bold uppercase tracking-wider text-gray-800">
                Total
              </p>
              <p className="text-lg font-bold text-gray-900">
                {formatPrice(totalPrice)}
              </p>
            </div>
          </div>

        </div>
      </div>

    </div>
  );
}