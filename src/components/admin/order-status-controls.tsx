"use client";

import { useTransition } from "react";
import { toast } from "sonner";
import { updatePaymentStatus, updateDeliveryStatus } from "@/actions/orders";
import {
  PAYMENT_STATUS_LABELS,
  DELIVERY_STATUS_LABELS,
  PAYMENT_STATUS_OPTIONS,
  DELIVERY_STATUS_OPTIONS,
} from "@/lib/labels";
import type { PaymentStatus, DeliveryStatus } from "@prisma/client";

export function OrderStatusControls({
  orderId,
  paymentStatus,
  deliveryStatus,
}: {
  orderId: string;
  paymentStatus: PaymentStatus;
  deliveryStatus: DeliveryStatus;
}) {
  const [isPending, startTransition] = useTransition();

  function handlePaymentChange(value: string) {
    startTransition(async () => {
      const result = await updatePaymentStatus(orderId, value as PaymentStatus);
      if (!result.success) toast.error(result.error);
      else toast.success("Statut de paiement mis à jour");
    });
  }

  function handleDeliveryChange(value: string) {
    startTransition(async () => {
      const result = await updateDeliveryStatus(
        orderId,
        value as DeliveryStatus,
      );
      if (!result.success) toast.error(result.error);
      else toast.success("Statut de livraison mis à jour");
    });
  }

  const selectClass =
    "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors disabled:opacity-60 appearance-none";

  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5";

  return (
    <div className="grid grid-cols-2 gap-4 font-poppins">
      <div>
        <label className={labelClass}>Paiement</label>
        <select
          value={paymentStatus}
          disabled={isPending}
          onChange={(e) => handlePaymentChange(e.target.value)}
          className={selectClass}
        >
          {PAYMENT_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {PAYMENT_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className={labelClass}>Livraison</label>
        <select
          value={deliveryStatus}
          disabled={isPending}
          onChange={(e) => handleDeliveryChange(e.target.value)}
          className={selectClass}
        >
          {DELIVERY_STATUS_OPTIONS.map((status) => (
            <option key={status} value={status}>
              {DELIVERY_STATUS_LABELS[status]}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}