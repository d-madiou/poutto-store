import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_STATUS_LABELS, DELIVERY_STATUS_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { LogOut, Package, ShoppingBag, CreditCard, Truck, Ticket } from "lucide-react";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="min-h-screen bg-neutral-50/50">
      <div className="container max-w-2xl mx-auto px-4 py-6 pb-24 md:py-10">
        
        {/* Profile Card */}
        <div className="rounded-2xl border border-neutral-200 bg-white p-6 mb-8 shadow-xs">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-600 bg-amber-500/5 px-2.5 py-1 rounded-lg border border-amber-500/10 inline-block">
                Profil Client
              </span>
              <h1 className="text-lg font-black text-neutral-900 mt-2.5">
                {user.name ?? "Mon compte"}
              </h1>
              <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider mt-0.5">{user.email}</p>
            </div>
            
            <form action={signOut} className="w-full sm:w-auto">
              <Button 
                type="submit" 
                size="lg"
                className="w-full sm:w-auto h-10 px-5 rounded-xl bg-red-600 text-white font-black text-xs uppercase tracking-wider hover:bg-red-700 transition-colors shadow-xs"
              >
                <LogOut className="mr-2 h-3.5 w-3.5 stroke-[2.5]" />
                Déconnexion
              </Button>
            </form>
          </div>
        </div>

        {/* Commandes Title */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-neutral-900 text-white">
            <Package className="h-4 w-4 stroke-[2.5]" />
          </div>
          <h2 className="text-xs font-black text-neutral-900 uppercase tracking-wider">
            Mes Commandes ({orders.length})
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="border border-neutral-200 bg-white rounded-2xl p-12 text-center shadow-xs">
            <p className="text-xs font-bold text-neutral-400 uppercase tracking-wider max-w-xs mx-auto">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Button asChild className="mt-5 h-10 px-6 rounded-xl bg-neutral-900 text-white font-black text-xs uppercase tracking-wider hover:bg-neutral-800 transition-colors">
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4 stroke-[2.5]" />
                Voir la collection
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-5">
            {orders.map((order) => {
              const isPaymentPending = order.paymentStatus === "PENDING";
              
              return (
                <li
                  key={order.id}
                  className="relative group overflow-visible"
                >
                  {/* Left Ticket Hole Punch */}
                  <div className="absolute left-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border-r border-neutral-200 z-10" />
                  
                  {/* Right Ticket Hole Punch */}
                  <div className="absolute right-[-8px] top-1/2 -translate-y-1/2 w-4 h-4 bg-neutral-50 rounded-full border-l border-neutral-200 z-10" />

                  <div className="relative flex flex-col items-stretch border border-neutral-200 rounded-2xl bg-white shadow-xs overflow-hidden">
                    
                    {/* Upper Ticket Stub (Header Meta) - Full Colored Premium Dark Neutral Background */}
                    <div className="bg-neutral-900 p-5 text-white flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1.5">
                          <Ticket className="h-3.5 w-3.5 text-amber-400 shrink-0" />
                          <span className="text-[9px] font-black uppercase tracking-wider text-amber-400 bg-white/10 px-2 py-0.5 rounded-md">
                            RÉCEPISSÉ COMMANDE
                          </span>
                        </div>
                        <h3 className="text-sm font-black tracking-tight">
                          #{shortId(order.id)}
                        </h3>
                        <p className="text-[10px] text-neutral-400 font-bold uppercase tracking-wider mt-0.5">
                          Émis le {formatDate(order.createdAt)}
                        </p>
                      </div>
                      
                      <div className="text-left sm:text-right">
                        <span className="text-xs font-bold text-neutral-400 uppercase tracking-wider block">Total Payé</span>
                        <p className="text-lg font-black text-white mt-0.5">
                          {formatPrice(Number(order.total))}
                        </p>
                      </div>
                    </div>

                    {/* Perforated Separator Line */}
                    <div className="relative flex items-center justify-between px-4">
                      <div className="border-t border-dashed border-neutral-200 w-full" />
                    </div>

                    {/* Lower Ticket Stub (Line Items list and Statuses) */}
                    <div className="p-5 bg-gradient-to-br from-white to-neutral-50/50">
                      
                      {/* Items Stream */}
                      <ul className="divide-y divide-neutral-100 text-xs pb-4">
                        {order.items.map((item) => (
                          <li key={item.id} className="flex items-center justify-between py-3 text-neutral-800">
                            <span className="truncate max-w-[280px] sm:max-w-none font-bold text-neutral-700">
                              {item.product.name}
                            </span>
                            <span className="text-[10px] font-black text-neutral-500 bg-neutral-100 border border-neutral-200/40 px-2.5 py-1 rounded-lg ml-4">
                              QTY: {item.quantity}
                            </span>
                          </li>
                        ))}
                      </ul>

                      {/* Status Badges Area */}
                      <div className="flex flex-wrap gap-2 border-t border-neutral-100 pt-4">
                        <span className={`inline-flex items-center gap-1.5 rounded-xl border px-3 py-1 text-[9px] font-black uppercase tracking-wider ${
                          isPaymentPending 
                            ? "bg-red-500/10 border-red-500/10 text-red-600" 
                            : "bg-emerald-500/10 border-emerald-500/10 text-emerald-600"
                        }`}>
                          <CreditCard className="h-3.5 w-3.5 stroke-[2.5]" />
                          {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                        </span>
                        
                        <span className="inline-flex items-center gap-1.5 rounded-xl border border-neutral-200 bg-white text-neutral-600 px-3 py-1 text-[9px] font-black uppercase tracking-wider shadow-xs">
                          <Truck className="h-3.5 w-3.5 stroke-[2.5]" />
                          {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                        </span>
                      </div>

                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </div>
    </div>
  );
}