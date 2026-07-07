"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart-context";
import { createOrder } from "@/actions/checkout";
import { formatPrice } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
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
    <form onSubmit={handleSubmit} className="space-y-6">
      {!isLoggedIn && (
        <fieldset className="space-y-3">
          <legend className="mb-1 font-display text-lg font-semibold text-foreground">
            Vos informations
          </legend>
          <input
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
            placeholder="Nom complet"
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
          <input
            required
            type="tel"
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
            placeholder="Numéro de téléphone"
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
          <input
            type="email"
            value={guestEmail}
            onChange={(e) => setGuestEmail(e.target.value)}
            placeholder="E-mail (optionnel, pour la confirmation)"
            className="h-12 w-full rounded-md border border-input bg-background px-3 text-sm"
          />
        </fieldset>
      )}

      <fieldset className="space-y-3">
        <legend className="mb-1 font-display text-lg font-semibold text-foreground">
          Livraison
        </legend>
        <textarea
          required
          value={deliveryAddress}
          onChange={(e) => setDeliveryAddress(e.target.value)}
          placeholder="Adresse complète de livraison"
          rows={3}
          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
        />
      </fieldset>

      <fieldset className="space-y-2">
        <legend className="mb-1 font-display text-lg font-semibold text-foreground">
          Paiement
        </legend>
        {(Object.keys(PAYMENT_METHOD_LABELS) as PaymentMethod[]).map((method) => (
          <label
            key={method}
            className="flex cursor-pointer items-center gap-3 rounded-md border border-input p-3"
          >
            <input
              type="radio"
              name="paymentMethod"
              checked={paymentMethod === method}
              onChange={() => setPaymentMethod(method)}
              className="h-4 w-4"
            />
            <span className="text-sm font-medium text-foreground">
              {PAYMENT_METHOD_LABELS[method]}
            </span>
          </label>
        ))}

        {paymentMethod === "ORANGE_MONEY" && ORANGE_MONEY_NUMBER && (
          <p className="rounded-md bg-secondary p-3 text-sm text-foreground">
            Envoyez le montant au <strong>{ORANGE_MONEY_NUMBER}</strong> puis
            confirmez votre commande. Nous vérifierons la réception du paiement.
          </p>
        )}
      </fieldset>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <div className="flex items-center justify-between border-t border-border pt-4">
        <p className="text-sm text-muted-foreground">Total</p>
        <p className="font-display text-xl font-semibold text-primary">
          {formatPrice(totalPrice)}
        </p>
      </div>

      <Button type="submit" size="lg" className="h-12 w-full" disabled={submitting}>
        {submitting ? "Traitement en cours…" : "Confirmer la commande"}
      </Button>
    </form>
  );
}