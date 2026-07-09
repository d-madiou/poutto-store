import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_STATUS_LABELS } from "@/lib/labels";
import { BarChart3, Clock, AlertTriangle, ArrowUpRight, ShoppingBag } from "lucide-react";

export default async function AdminDashboardPage() {
  const [
    totalOrders,
    pendingPayments,
    lowStockProducts,
    recentOrders,
  ] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { paymentStatus: "PENDING" } }),
    prisma.product.count({ where: { status: "ACTIVE", stock: { lte: 3 } } }),
    prisma.order.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { user: true },
    }),
  ]);

  const stats = [
    { 
      label: "Commandes totales", 
      value: totalOrders, 
      href: "/admin/orders",
      icon: BarChart3,
      variant: "default"
    },
    {
      label: "Paiements en attente",
      value: pendingPayments,
      href: "/admin/orders?paymentStatus=PENDING",
      alert: pendingPayments > 0,
      icon: Clock,
      variant: pendingPayments > 0 ? "warning" : "default"
    },
    {
      label: "Stock faible",
      value: lowStockProducts,
      href: "/admin/products",
      alert: lowStockProducts > 0,
      icon: AlertTriangle,
      variant: lowStockProducts > 0 ? "danger" : "default"
    },
  ];

  return (
    <div className="space-y-6 max-w-7xl mx-auto px-4 py-4 md:py-8 pb-24">
      {/* Dashboard Section Title */}
      <div className="flex items-center gap-2 border-b border-border/60 pb-3">
        <div className="h-2 w-2 bg-primary" />
        <h1 className="font-sans text-xs font-black uppercase tracking-widest text-foreground">
          Console d'administration
        </h1>
      </div>

      {/* KPI Metric Blocks Grid */}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <Link
              key={stat.label}
              href={stat.href}
              className="group relative flex flex-col justify-between border border-border bg-card p-4 transition-colors hover:border-primary/40 rounded-none"
            >
              <div className="flex items-start justify-between">
                <span className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {stat.label}
                </span>
                <div className={`flex h-7 w-7 items-center justify-center border ${
                  stat.variant === "danger" 
                    ? "bg-destructive/10 border-destructive/20 text-destructive"
                    : stat.variant === "warning"
                    ? "bg-brass/10 border-brass/20 text-brass"
                    : "bg-secondary/40 border-border/60 text-muted-foreground"
                }`}>
                  <Icon className="h-3.5 w-3.5 stroke-[2]" />
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between">
                <p className={`font-mono text-2xl font-black tracking-tight ${
                  stat.alert && stat.variant === "danger"
                    ? "text-destructive"
                    : stat.alert && stat.variant === "warning"
                    ? "text-brass"
                    : "text-foreground"
                }`}>
                  {stat.value}
                </p>
                <span className="text-[9px] font-bold uppercase tracking-widest text-primary opacity-0 transition-opacity group-hover:opacity-100 flex items-center gap-0.5">
                  Gérer <ArrowUpRight className="h-2.5 w-2.5" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders Module Stream */}
      <div className="mt-8">
        <div className="mb-3 flex items-center justify-between border-b border-border/40 pb-2">
          <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-widest text-foreground">
            <ShoppingBag className="h-3.5 w-3.5 stroke-[2]" />
            <h2>Flux des commandes récentes</h2>
          </div>
          <Link 
            href="/admin/orders" 
            className="font-sans text-[10px] font-bold uppercase tracking-wider text-primary hover:opacity-80"
          >
            Tout voir
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <div className="border border-dashed border-border bg-secondary/10 p-12 text-center">
            <p className="text-xs font-medium text-muted-foreground">
              Aucune transaction enregistrée pour le moment.
            </p>
          </div>
        ) : (
          <ul className="divide-y divide-border/60 border border-border bg-card rounded-none">
            {recentOrders.map((order) => {
              const isPaymentPending = order.paymentStatus === "PENDING";
              return (
                <li key={order.id} className="group">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between transition-colors hover:bg-secondary/20"
                  >
                    <div className="min-w-0">
                      <p className="font-mono text-xs font-bold text-foreground group-hover:text-primary transition-colors">
                        #{shortId(order.id)} — {order.user?.name ?? order.guestName ?? "Invité"}
                      </p>
                      <p className="mt-0.5 text-[11px] text-muted-foreground font-medium">
                        Reçu le {formatDate(order.createdAt)}
                      </p>
                    </div>

                    <div className="flex items-center justify-between gap-4 border-t border-border/40 pt-2 sm:border-t-0 sm:pt-0 sm:flex-col sm:items-end sm:gap-1.5">
                      <span className="font-mono text-xs font-black text-foreground">
                        {formatPrice(Number(order.total))}
                      </span>
                      
                      {/* Unified Hard-Edged Micro Status Badge */}
                      <span className={`inline-block border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                        isPaymentPending 
                          ? "bg-destructive/10 border-destructive/20 text-destructive" 
                          : "bg-emerald-50 border-emerald-200 text-emerald-700"
                      }`}>
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
  );
}