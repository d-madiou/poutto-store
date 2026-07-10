import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_STATUS_LABELS } from "@/lib/labels";
import { BarChart3, Clock, AlertTriangle, ShoppingBag } from "lucide-react";

export default async function AdminDashboardPage() {
  const [totalOrders, pendingPayments, lowStockProducts, recentOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { paymentStatus: "PENDING" } }),
      prisma.product.count({
        where: { status: "ACTIVE", stock: { lte: 3 } },
      }),
      prisma.order.findMany({
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { user: true },
      }),
    ]);

  const stats = [
    {
      label: "Commandes",
      value: totalOrders,
      href: "/admin/orders",
      icon: BarChart3,
      bg: "bg-[#1D4ED8]",
      textColor: "text-white",
      labelColor: "text-blue-100",
      iconBg: "bg-white/20 text-white",
    },
    {
      label: "En attente",
      value: pendingPayments,
      href: "/admin/orders?paymentStatus=PENDING",
      icon: Clock,
      bg: "bg-[#E07B39]",
      textColor: "text-white",
      labelColor: "text-orange-100",
      iconBg: "bg-white/20 text-white",
    },
    {
      label: "Stock faible",
      value: lowStockProducts,
      href: "/admin/products",
      icon: AlertTriangle,
      bg: "bg-[#B91C1C]",
      textColor: "text-white",
      labelColor: "text-red-100",
      iconBg: "bg-white/20 text-white",
    },
  ];

  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="max-w-5xl mx-auto px-4 py-5 space-y-6 md:py-8">
        {/* Titre */}
        <div className="flex items-center gap-2 border-b border-gray-100 pb-3">
          <h1 className="text-base font-bold text-gray-900">
            Tableau de bord
          </h1>
        </div>

        {/* KPI Cards – fonds pleins */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Link
                key={stat.label}
                href={stat.href}
                className={`${stat.bg} rounded-xl p-4 flex items-center justify-between active:scale-[0.98] transition-transform`}
              >
                <div>
                  <p className={`text-xs font-semibold uppercase tracking-wider ${stat.labelColor}`}>
                    {stat.label}
                  </p>
                  <p className={`text-2xl font-bold mt-1 ${stat.textColor}`}>
                    {stat.value}
                  </p>
                </div>
                <div className={`flex h-10 w-10 items-center justify-center rounded-xl ${stat.iconBg}`}>
                  <Icon className="h-5 w-5" />
                </div>
              </Link>
            );
          })}
        </div>

        {/* Commandes récentes */}
        <div>
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-gray-100 text-gray-600">
                <ShoppingBag className="h-3.5 w-3.5" />
              </div>
              <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
                Commandes récentes
              </h2>
            </div>
            <Link
              href="/admin/orders"
              className="text-xs font-semibold text-[#E07B39] hover:text-orange-600 transition-colors"
            >
              Tout voir
            </Link>
          </div>

          {recentOrders.length === 0 ? (
            <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
              <p className="text-sm font-medium text-gray-500">
                Aucune commande pour le moment.
              </p>
            </div>
          ) : (
            <ul className="divide-y divide-gray-100 border border-gray-200 bg-white rounded-xl overflow-hidden">
              {recentOrders.map((order) => {
                const isPaymentPending = order.paymentStatus === "PENDING";
                return (
                  <li key={order.id}>
                    <Link
                      href={`/admin/orders/${order.id}`}
                      className="flex items-center justify-between gap-3 p-4 active:bg-gray-50 transition-colors"
                    >
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-gray-800 truncate">
                          #{shortId(order.id)}
                        </p>
                        <p className="text-xs text-gray-500 mt-0.5">
                          {order.user?.name ?? order.guestName ?? "Invité"} ·{" "}
                          {formatDate(order.createdAt)}
                        </p>
                      </div>
                      <div className="flex items-center gap-3 shrink-0">
                        <span className="text-sm font-bold text-gray-900">
                          {formatPrice(Number(order.total))}
                        </span>
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                            isPaymentPending
                              ? "bg-red-50 text-red-600"
                              : "bg-emerald-50 text-emerald-600"
                          }`}
                        >
                          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                        </span>
                      </div>
                    </Link>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}