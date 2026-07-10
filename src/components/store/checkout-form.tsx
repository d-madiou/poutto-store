"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/actions/checkout";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { User, Truck, CreditCard, Info } from "lucide-react";
import type { PaymentMethod } from "@prisma/client";

const ORANGE_MONEY_NUMBER = process.env.NEXT_PUBLIC_ORANGE_MONEY_NUMBER;

export function CheckoutForm({ isLoggedIn }: { isLoggedIn: boolean }) {
  const router = useRouter();
  const { items, totalPrice, clearCart } = useCart();

  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [guestEmail, setGuestEmail] = useState("");
  const [deliveryAddress, setDeliveryAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CASH");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const result = await createOrder({
      items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
      deliveryAddress,
      paymentMethod,
      guestName,
      guestPhone,
      guestEmail,
    });

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    clearCart();
    router.push(`/checkout/success/${result.orderId}`);
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 font-poppins">
      
      {/* 1. Informations personnelles (si non connecté) */}
      {!isLoggedIn && (
        <fieldset className="space-y-3">
          <legend className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 w-full">
            <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-gray-600">
              <User className="h-3.5 w-3.5" />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
              Vos informations
            </span>
          </legend>
          <input
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Nom complet"
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
          />
          <input
            required
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="Numéro de téléphone"
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
          />
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="E-mail (optionnel)"
            className="h-11 w-full rounded-xl border border-gray-200 bg-white px-3.5 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors"
          />
        </fieldset>
      )}

      {/* 2. Adresse de livraison */}
      <fieldset className="space-y-3">
        <legend className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 w-full">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-gray-600">
            <Truck className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Livraison
          </span>
        </legend>
        <textarea
          required
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Adresse complète (Ville, Quartier, Indications...)"
          rows={3}
          className="w-full rounded-xl border border-gray-200 bg-white px-3.5 py-3 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors resize-none"
        />
      </fieldset>

      {/* 3. Mode de paiement */}
      <fieldset className="space-y-2.5">
        <legend className="mb-3 flex items-center gap-2 border-b border-gray-100 pb-2 w-full">
          <div className="flex h-5 w-5 items-center justify-center rounded-md bg-gray-100 text-gray-600">
            <CreditCard className="h-3.5 w-3.5" />
          </div>
          <span className="text-xs font-bold uppercase tracking-wider text-gray-800">
            Mode de paiement
          </span>
        </legend>
        
        {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((method) => {
          const isSelected = paymentMethod === method;
          return (
            <label
              key={method}
              className={`flex cursor-pointer items-center gap-3 rounded-xl border p-3.5 transition-colors ${
                isSelected 
                  ? "border-[#E07B39] bg-[#E07B39]/5" 
                  : "border-gray-200 bg-white hover:border-gray-300"
              }`}
            >
              <input
                type="radio"
                name="paymentMethod"
                checked={isSelected}
                onChange={() => setPaymentMethod(method)}
                className="h-4 w-4 accent-[#E07B39] cursor-pointer"
              />
              <span className={`text-xs font-semibold uppercase tracking-wider ${isSelected ? "text-gray-900" : "text-gray-700"}`}>
                {PAYMENT_METHOD_LABELS[method]}
              </span>
            </label>
          );
        })}

        {paymentMethod === "ORANGE_MONEY" && ORANGE_MONEY_NUMBER && (
          <div className="rounded-xl bg-gray-50 border border-gray-200 p-3.5 flex gap-2.5 items-start">
            <Info className="h-4 w-4 text-[#E07B39] shrink-0 mt-0.5" />
            <p className="text-xs font-medium text-gray-600 leading-relaxed">
              Transférez le montant au <strong>{ORANGE_MONEY_NUMBER}</strong>, puis validez. Nous vérifierons le paiement sous peu.
            </p>
          </div>
        )}
      </fieldset>

      {/* Message d'erreur */}
      {error && (
        <div className="rounded-xl bg-red-50 border border-red-200 p-3.5 text-xs font-semibold text-red-600">
          {error}
        </div>
      )}

      {/* Total et bouton de confirmation */}
      <div className="flex items-center justify-between border-t border-gray-100 pt-4">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-500">Total à payer</p>
        <p className="text-xl font-bold text-gray-900">
          {formatPrice(totalPrice)}
        </p>
      </div>

      <Button 
        type="submit" 
        size="lg" 
        className="h-12 w-full rounded-xl bg-[#E07B39] text-white font-semibold tracking-wide hover:bg-orange-600 transition-colors disabled:opacity-50" 
        disabled={submitting}
      >
        {submitting ? "Traitement en cours…" : "Confirmer la commande"}
      </Button>
    </form>
  );
}