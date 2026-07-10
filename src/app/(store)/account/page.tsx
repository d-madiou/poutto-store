import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_STATUS_LABELS, DELIVERY_STATUS_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { LogOut, Package, ShoppingBag, CreditCard, Truck } from "lucide-react";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="min-h-screen bg-white font-poppins">
      <div className="container max-w-2xl mx-auto px-4 py-6 pb-24 md:py-10">
        
        {/* Profil */}
        <div className="rounded-2xl border border-gray-200 bg-white p-6 mb-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <span className="text-xs font-semibold uppercase tracking-wider text-[#E07B39]">
                Profil
              </span>
              <h1 className="text-xl font-bold text-gray-900 mt-1">
                {user.name ?? "Mon compte"}
              </h1>
              <p className="text-sm text-gray-500 mt-0.5">{user.email}</p>
            </div>
            
            <form action={signOut} className="w-full sm:w-auto">
              <Button 
                type="submit" 
                size="lg"
                className="w-full sm:w-auto h-10 px-6 rounded-xl bg-red-600 text-white font-semibold text-sm hover:bg-red-700 transition-colors"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </Button>
            </form>
          </div>
        </div>

        {/* Commandes */}
        <div className="flex items-center gap-2 mb-5">
          <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-gray-100 text-gray-600">
            <Package className="h-4 w-4" />
          </div>
          <h2 className="text-sm font-bold text-gray-900 uppercase tracking-wide">
            Commandes ({orders.length})
          </h2>
        </div>

        {orders.length === 0 ? (
          <div className="border border-gray-200 bg-white rounded-2xl p-12 text-center">
            <p className="text-sm font-medium text-gray-500 max-w-xs mx-auto">
              Vous n&apos;avez pas encore passé de commande.
            </p>
            <Button asChild className="mt-5 h-10 px-6 rounded-xl bg-[#E07B39] text-white font-semibold text-sm hover:bg-orange-600 transition-colors">
              <Link href="/products" className="flex items-center gap-2">
                <ShoppingBag className="h-4 w-4" />
                Voir la collection
              </Link>
            </Button>
          </div>
        ) : (
          <ul className="space-y-4">
            {orders.map((order) => {
              const isPaymentPending = order.paymentStatus === "PENDING";
              
              return (
                <li
                  key={order.id}
                  className="rounded-2xl border border-gray-200 bg-white p-5"
                >
                  {/* En-tête commande */}
                  <div className="flex items-start justify-between gap-4 border-b border-gray-100 pb-3">
                    <div>
                      <p className="text-sm font-bold text-gray-800">
                        #{shortId(order.id)}
                      </p>
                      <p className="mt-0.5 text-xs font-medium text-gray-500">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>
                    <p className="text-base font-bold text-gray-900">
                      {formatPrice(Number(order.total))}
                    </p>
                  </div>

                  {/* Articles */}
                  <ul className="divide-y divide-gray-100 text-sm">
                    {order.items.map((item) => (
                      <li key={item.id} className="flex items-center justify-between py-2.5 text-gray-700">
                        <span className="truncate max-w-[280px] sm:max-w-none font-medium">
                          {item.product.name}
                        </span>
                        <span className="text-xs font-semibold text-gray-500 bg-gray-50 border border-gray-100 px-2 py-0.5 rounded-lg ml-4">
                          × {item.quantity}
                        </span>
                      </li>
                    ))}
                  </ul>

                  {/* Statuts */}
                  <div className="mt-3 flex flex-wrap gap-2 border-t border-gray-100 pt-3">
                    <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                      isPaymentPending 
                        ? "bg-red-50 text-red-600" 
                        : "bg-emerald-50 text-emerald-600"
                    }`}>
                      <CreditCard className="h-3 w-3" />
                      {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                    </span>
                    
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 text-gray-600 px-3 py-1 text-xs font-semibold">
                      <Truck className="h-3 w-3" />
                      {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                    </span>
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