import { redirect } from "next/navigation";
import Link from "next/link";
import { getCurrentUser } from "@/lib/auth";
import { signOut } from "@/actions/auth";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_STATUS_LABELS, DELIVERY_STATUS_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";
import { LogOut, Package, ShoppingBag } from "lucide-react";

export default async function AccountPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/account");

  const orders = await prisma.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
    include: { items: { include: { product: true } } },
  });

  return (
    <div className="container max-w-xl px-4 py-6 pb-20 md:py-10">
      
      {/* Profile Info Module — Rigid, Clean Enterprise Panel Header */}
      <div className="border border-border bg-card p-4 mb-8 sm:p-5">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="space-y-0.5">
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground block">
              Profil Client
            </span>
            <h1 className="font-sans text-lg font-black text-foreground uppercase tracking-tight">
              {user.name ?? "Mon compte"}
            </h1>
            <p className="font-mono text-xs text-muted-foreground">{user.email}</p>
          </div>
          
          <form action={signOut} className="w-full sm:w-auto">
            <Button 
              type="submit" 
              variant="outline" 
              size="sm"
              className="h-9 w-full rounded-none border-border text-xs font-bold uppercase tracking-wider text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive sm:w-auto"
            >
              <LogOut className="mr-2 h-3.5 w-3.5 stroke-[2]" />
              Déconnexion
            </Button>
          </form>
        </div>
      </div>

      {/* Orders Section Title Header */}
      <div className="mb-4 flex items-center gap-2 border-b border-border pb-2">
        <Package className="h-4 w-4 text-muted-foreground stroke-[2]" />
        <h2 className="font-sans text-xs font-black uppercase tracking-widest text-foreground">
          Historique des commandes ({orders.length})
        </h2>
      </div>

      {/* Empty State Layout Block */}
      {orders.length === 0 ? (
        <div className="border border-dashed border-border bg-secondary/10 p-8 text-center">
          <p className="text-xs font-medium text-muted-foreground">
            Vous n&apos;avez pas encore passé de commande sur Poutou Store.
          </p>
          <Button asChild size="sm" className="mt-4 rounded-none bg-primary text-xs font-bold uppercase tracking-widest">
            <Link href="/products" className="flex items-center gap-2">
              <ShoppingBag className="h-3.5 w-3.5" />
              Voir la collection
            </Link>
          </Button>
        </div>
      ) : (
        /* Order List Stream */
        <ul className="space-y-4">
          {orders.map((order) => {
            const isPaymentPending = order.paymentStatus === "PENDING";
            
            return (
              <li
                key={order.id}
                className="rounded-none border border-border bg-card p-4 transition-colors hover:border-border/80"
              >
                {/* Meta Bar */}
                <div className="flex items-start justify-between gap-4 border-b border-border/40 pb-3">
                  <div>
                    <p className="font-mono text-xs font-bold text-foreground">
                      N° #{shortId(order.id)}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground font-medium">
                      Passée le {formatDate(order.createdAt)}
                    </p>
                  </div>
                  
                  {/* Clean Price Typography matching all retail blocks */}
                  <p className="text-sm font-black tracking-tight text-primary">
                    {formatPrice(Number(order.total))}
                  </p>
                </div>

                {/* Ordered Items Inner List */}
                <ul className="divide-y divide-border/30 text-xs">
                  {order.items.map((item) => (
                    <li key={item.id} className="flex items-center justify-between py-2.5 text-foreground/90">
                      <span className="font-medium truncate max-w-[280px] sm:max-w-none">
                        {item.product.name}
                      </span>
                      <span className="font-sans text-[11px] text-muted-foreground font-bold shrink-0 ml-4">
                        × {item.quantity}
                      </span>
                    </li>
                  ))}
                </ul>

                {/* Hard-edged Retail Label Status Badges Block */}
                <div className="mt-3 flex flex-wrap gap-1.5 border-t border-border/40 pt-3">
                  <span className={`inline-block border px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                    isPaymentPending 
                      ? "bg-destructive/10 border-destructive/20 text-destructive" 
                      : "bg-emerald-50 border-emerald-200 text-emerald-700"
                  }`}>
                    {PAYMENT_STATUS_LABELS[order.paymentStatus]}
                  </span>
                  
                  <span className="inline-block border border-border bg-secondary/50 px-2 py-0.5 text-[9px] font-black uppercase tracking-wider text-muted-foreground">
                    {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
                  </span>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}