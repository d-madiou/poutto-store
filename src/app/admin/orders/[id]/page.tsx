import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { formatPrice, formatDate, shortId } from "@/lib/format";
import { PAYMENT_METHOD_LABELS } from "@/lib/labels";
import { OrderStatusControls } from "@/components/admin/order-status-controls";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const order = await prisma.order.findUnique({
    where: { id },
    include: { items: { include: { product: true } }, user: true },
  });

  if (!order) notFound();

  const customerName = order.user?.name ?? order.guestName ?? "Invité";
  const customerPhone = order.user?.phone ?? order.guestPhone;
  const customerEmail = order.user?.email ?? order.guestEmail;

  return (
    <div className="max-w-lg">
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Commande #{shortId(order.id)}
      </h1>
      <p className="text-sm text-muted-foreground">{formatDate(order.createdAt)}</p>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Client</h2>
        <p className="text-sm text-foreground">{customerName}</p>
        {customerPhone && (
          <p className="text-sm text-muted-foreground">{customerPhone}</p>
        )}
        {customerEmail && (
          <p className="text-sm text-muted-foreground">{customerEmail}</p>
        )}
        <p className="mt-2 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Adresse : </span>
          {order.deliveryAddress}
        </p>
        <p className="mt-1 text-sm text-muted-foreground">
          <span className="font-medium text-foreground">Paiement : </span>
          {PAYMENT_METHOD_LABELS[order.paymentMethod]}
        </p>
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Statuts</h2>
        <OrderStatusControls
          orderId={order.id}
          paymentStatus={order.paymentStatus}
          deliveryStatus={order.deliveryStatus}
        />
      </div>

      <div className="mt-4 rounded-lg border border-border bg-card p-4">
        <h2 className="mb-2 text-sm font-semibold text-foreground">Articles</h2>
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
        <div className="mt-2 flex justify-between border-t border-border pt-2">
          <span className="font-medium text-foreground">Total</span>
          <span className="font-display text-lg font-semibold text-primary">
            {formatPrice(Number(order.total))}
          </span>
        </div>
      </div>
    </div>
  );
}