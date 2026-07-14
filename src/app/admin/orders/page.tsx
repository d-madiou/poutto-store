import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import {
  PAYMENT_STATUS_LABELS,
  DELIVERY_STATUS_LABELS,
  PAYMENT_STATUS_OPTIONS,
  DELIVERY_STATUS_OPTIONS,
} from "@/lib/labels";
import { ShoppingBag, CreditCard, Truck, Ticket } from "lucide-react";
import type { PaymentStatus, DeliveryStatus } from "@prisma/client";

function isPaymentStatus(v: string | undefined): v is PaymentStatus {
  return !!v && (PAYMENT_STATUS_OPTIONS as readonly string[]).includes(v);
}
function isDeliveryStatus(v: string | undefined): v is DeliveryStatus {
  return !!v && (DELIVERY_STATUS_OPTIONS as readonly string[]).includes(v);
}

export default async function AdminOrdersPage({
  searchParams,
}: {
  searchParams: Promise<{ paymentStatus?: string; deliveryStatus?: string }>;
}) {
  const params = await searchParams;
  const paymentFilter = isPaymentStatus(params.paymentStatus)
    ? params.paymentStatus
    : undefined;
  const deliveryFilter = isDeliveryStatus(params.deliveryStatus)
    ? params.deliveryStatus
    : undefined;

  const orders = await prisma.order.findMany({
    where: {
      ...(paymentFilter ? { paymentStatus: paymentFilter } : {}),
      ...(deliveryFilter ? { deliveryStatus: deliveryFilter } : {}),
    },
    orderBy: { createdAt: "desc" },
    include: { user: true },
  });

  function filterHref(key: "paymentStatus" | "deliveryStatus", value?: string) {
    const qs = new URLSearchParams();
    if (key === "paymentStatus" && value) qs.set("paymentStatus", value);
    else if (paymentFilter) qs.set("paymentStatus", paymentFilter);
    if (key === "deliveryStatus" && value) qs.set("deliveryStatus", value);
    else if (deliveryFilter) qs.set("deliveryStatus", deliveryFilter);
    const s = qs.toString();
    return s ? `/admin/orders?${s}` : "/admin/orders";
  }

  const activePillClass =
    "bg-amber-500 text-neutral-950 border-amber-600 shadow-xs";
  const inactivePillClass =
    "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300 hover:bg-neutral-50/50";

  return (
    <div className="bg-neutral-50 min-h-screen">
      <div className="space-y-6 max-w-5xl mx-auto px-4 py-6 md:py-10 pb-24 font-poppins">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-neutral-200 pb-3.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
          </div>
          <h1 className="text-xs font-black uppercase tracking-wider text-neutral-900">
            Gestion des commandes
          </h1>
        </div>

        {/* Filtres */}
        <div className="space-y-3 bg-white p-4 border border-neutral-200/80 rounded-2xl shadow-xs">
          {/* Paiement */}
          <div className="flex items-center gap-2">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-neutral-400">
              <CreditCard className="h-3.5 w-3.5" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href={filterHref("paymentStatus", undefined)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  !paymentFilter ? activePillClass : inactivePillClass
                }`}
              >
                Tous les paiements
              </Link>
              {PAYMENT_STATUS_OPTIONS.map((status) => (
                <Link
                  key={status}
                  href={filterHref("paymentStatus", status)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all border ${
                    paymentFilter === status ? activePillClass : inactivePillClass
                  }`}
                >
                  {PAYMENT_STATUS_LABELS[status]}
                </Link>
              ))}
            </div>
          </div>

          {/* Livraison */}
          <div className="flex items-center gap-2 pt-2 border-t border-neutral-100">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded-md text-neutral-400">
              <Truck className="h-3.5 w-3.5" />
            </div>
            <div className="flex gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              <Link
                href={filterHref("deliveryStatus", undefined)}
                className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all border ${
                  !deliveryFilter ? activePillClass : inactivePillClass
                }`}
              >
                Toutes les livraisons
              </Link>
              {DELIVERY_STATUS_OPTIONS.map((status) => (
                <Link
                  key={status}
                  href={filterHref("deliveryStatus", status)}
                  className={`shrink-0 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase tracking-wider transition-all border ${
                    deliveryFilter === status ? activePillClass : inactivePillClass
                  }`}
                >
                  {DELIVERY_STATUS_LABELS[status]}
                </Link>
              ))}
            </div>
          </div>
        </div>

        {/* Liste des commandes */}
        {orders.length === 0 ? (
          <div className="border border-neutral-200 bg-white rounded-2xl p-12 text-center shadow-xs">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
              Aucune commande ne correspond à ce filtre.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => {
              const isPaymentPending = order.paymentStatus === "PENDING";

              return (
                <div key={order.id} className="relative group">
                  {/* Trous de ticket */}
                  <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border-r border-neutral-200 z-10" />
                  <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border-l border-neutral-200 z-10" />

                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="relative flex flex-col md:flex-row items-stretch border border-neutral-200 rounded-2xl bg-gradient-to-br from-white to-neutral-50/70 shadow-xs hover:shadow-md hover:border-amber-500/40 transition-all duration-300"
                  >
                    {/* Partie gauche : infos client */}
                    <div className="flex-1 p-5 flex flex-col justify-between min-w-0">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Ticket className="h-3.5 w-3.5 text-amber-500 shrink-0" />
                          <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/5 px-2 py-0.5 rounded-md border border-amber-500/10">
                            COMMANDE TICKET
                          </span>
                        </div>
                        <h3 className="text-sm font-black text-neutral-900 group-hover:text-amber-600 transition-colors truncate">
                          #{shortId(order.id)} —{" "}
                          {order.user?.name ?? order.guestName ?? "Invité"}
                        </h3>
                        <p className="text-[11px] text-neutral-400 font-bold uppercase tracking-wider mt-1">
                          Émis le {formatDate(order.createdAt)}
                        </p>
                      </div>
                    </div>

                    {/* Séparateur pointillé */}
                    <div className="relative flex md:flex-col items-center justify-between px-5 md:px-0 md:py-4">
                      <div className="hidden md:block absolute top-0 bottom-0 left-1/2 -translate-x-1/2 border-l border-dashed border-neutral-300 h-full" />
                      <div className="block md:hidden absolute left-0 right-0 top-1/2 -translate-y-1/2 border-t border-dashed border-neutral-300 w-full" />
                    </div>

                    {/* Partie droite : prix + statuts */}
                    <div className="w-full md:w-72 p-5 bg-neutral-100/40 md:bg-transparent flex flex-row md:flex-col items-center md:items-end justify-between md:justify-center gap-3 rounded-b-2xl md:rounded-r-2xl">
                      <span className="text-sm font-black text-neutral-900 bg-white border border-neutral-200/80 px-3 py-1 rounded-xl shadow-xs">
                        {formatPrice(Number(order.total))}
                      </span>

                      <div className="flex flex-wrap gap-1.5">
                        <span
                          className={`inline-flex items-center rounded-xl border px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                            isPaymentPending
                              ? "bg-red-500/10 border-red-500/10 text-red-600"
                              : "bg-emerald-500/10 border-emerald-500/10 text-emerald-600"
                          }`}
                        >
                          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                        </span>

                        <span className="inline-flex items-center rounded-xl border border-neutral-200 bg-white text-neutral-600 px-2.5 py-0.5 text-[9px] font-black uppercase tracking-wider shadow-xs">
                          {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                        </span>
                      </div>
                    </div>
                  </Link>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}