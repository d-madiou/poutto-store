import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_METHOD_LABELS, DELIVERY_STATUS_LABELS } from "@/lib/labels";
import { Button } from "@/components/ui/button";

export default async function CheckoutSuccessPage({
  params,
}: {
  params: Promise<{ orderId: string }>;
}) {
  const { orderId } = await params;

  const order = await prisma.order.findUnique({
    where: { id: orderId },
    include: { items: { include: { product: true } } },
  });

  if (!order) notFound();

  const orangeMoneyNumber = process.env.NEXT_PUBLIC_ORANGE_MONEY_NUMBER;

  return (
    <div className="container max-w-lg py-10 pb-16">
      <div className="flex flex-col items-center gap-2 text-center">
        <CheckCircle2 className="h-12 w-12 text-primary" />
        <h1 className="font-display text-2xl font-semibold text-foreground">
          Commande confirmée
        </h1>
        <p className="text-sm text-muted-foreground">
          Commande #{shortId(order.id)} · {formatDate(order.createdAt)}
        </p>
      </div>

      <div className="mt-6 space-y-4 rounded-lg border border-border bg-card p-4">
        <ul className="divide-y divide-border">
          {order.items.map((item) => (
            <li key={item.id} className="flex justify-between py-2 text-sm">
              <span className="text-foreground">
                {item.product.name} × {item.quantity}
              </span>
              <span className="font-medium text-foreground">
                {formatPrice(Number(item.priceAtPurchase) * item.quantity)}
              </span>
            </li>
          ))}
        </ul>

        <div className="flex justify-between border-t border-border pt-3">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-display text-lg font-semibold text-primary">
            {formatPrice(Number(order.total))}
          </span>
        </div>

        <dl className="space-y-1 border-t border-border pt-3 text-sm">
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Paiement</dt>
            <dd className="font-medium text-foreground">
              {PAYMENT_METHOD_LABELS[order.paymentMethod]}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Livraison</dt>
            <dd className="font-medium text-foreground">
              {DELIVERY_STATUS_LABELS[order.deliveryStatus]}
            </dd>
          </div>
          <div className="flex justify-between">
            <dt className="text-muted-foreground">Adresse</dt>
            <dd className="max-w-[60%] text-right font-medium text-foreground">
              {order.deliveryAddress}
            </dd>
          </div>
        </dl>
      </div>

      {order.paymentMethod === "ORANGE_MONEY" && orangeMoneyNumber && (
        <p className="mt-4 rounded-md bg-secondary p-3 text-sm text-foreground">
          N&apos;oubliez pas d&apos;envoyer le montant au{" "}
          <strong>{orangeMoneyNumber}</strong> si ce n&apos;est pas déjà fait.
          Nous confirmerons la réception du paiement.
        </p>
      )}

      <div className="mt-6 flex justify-center">
        <Button asChild size="lg">
          <Link href="/products">Continuer mes achats</Link>
        </Button>
      </div>
    </div>
  );
}