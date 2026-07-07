import { Resend } from "resend";
import type { Prisma } from "@prisma/client";
import OrderConfirmationEmail from "@/emails/order-confirmation";
import OrderStatusUpdateEmail from "@/emails/order-status-update";
import BroadcastEmail from "@/emails/broadcast";
import { shortId } from "@/lib/format";

const apiKey = process.env.RESEND_API_KEY;
const resend = apiKey ? new Resend(apiKey) : null;

const FROM = process.env.EMAIL_FROM ?? "Poutou Store <onboarding@resend.dev>";
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";
const ORANGE_MONEY = process.env.NEXT_PUBLIC_ORANGE_MONEY_NUMBER;

export type OrderForEmail = Prisma.OrderGetPayload<{
  include: { items: { include: { product: true } }; user: true };
}>;

function recipientOf(order: OrderForEmail): string | null {
  return order.user?.email ?? order.guestEmail ?? null;
}

function customerNameOf(order: OrderForEmail): string {
  return order.user?.name ?? order.guestName ?? "cher client";
}

/** Confirmation de commande envoyée au checkout (silencieux si Resend absent). */
export async function sendOrderConfirmationEmail(order: OrderForEmail): Promise<void> {
  const to = recipientOf(order);
  if (!resend || !to) {
    if (!resend) console.warn("[email] RESEND_API_KEY absent — confirmation non envoyée.");
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: `Commande #${shortId(order.id)} confirmée — Poutou Store`,
    react: OrderConfirmationEmail({
      orderRef: shortId(order.id),
      customerName: customerNameOf(order),
      items: order.items.map((i) => ({
        name: i.product.name,
        quantity: i.quantity,
        price: Number(i.priceAtPurchase),
      })),
      total: Number(order.total),
      paymentMethod: order.paymentMethod,
      deliveryAddress: order.deliveryAddress,
      orangeMoneyNumber: ORANGE_MONEY,
    }),
  });
}

/** E-mail de suivi quand la commande passe à Expédiée / Livrée. */
export async function sendOrderStatusEmail(
  order: OrderForEmail,
  status: "SHIPPED" | "DELIVERED"
): Promise<void> {
  const to = recipientOf(order);
  if (!resend || !to) {
    if (!resend) console.warn("[email] RESEND_API_KEY absent — suivi non envoyé.");
    return;
  }
  await resend.emails.send({
    from: FROM,
    to,
    subject: `${status === "SHIPPED" ? "Commande expédiée" : "Commande livrée"} — #${shortId(order.id)}`,
    react: OrderStatusUpdateEmail({
      orderRef: shortId(order.id),
      customerName: customerNameOf(order),
      status,
    }),
  });
}

/** Diffusion marketing simple à une liste d'e-mails, par lots de 50. */
export async function sendBroadcastEmails(
  emails: string[],
  subject: string,
  message: string
): Promise<number> {
  if (!resend) {
    throw new Error("RESEND_API_KEY manquante : configurez Resend pour envoyer une diffusion.");
  }
  const unique = Array.from(new Set(emails.map((e) => e.trim().toLowerCase()))).filter(Boolean);
  let sent = 0;
  for (let i = 0; i < unique.length; i += 50) {
    const chunk = unique.slice(i, i + 50);
    await resend.batch.send(
      chunk.map((to) => ({
        from: FROM,
        to,
        subject,
        react: BroadcastEmail({ subject, message, siteUrl: SITE_URL }),
      }))
    );
    sent += chunk.length;
  }
  return sent;
}
