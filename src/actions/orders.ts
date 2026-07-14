"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth";
import { sendOrderStatusEmail } from "@/lib/email";
import type { PaymentStatus, DeliveryStatus } from "@prisma/client";

export type ActionResult = { success: true } | { success: false; error: string };

export async function updatePaymentStatus(
  orderId: string,
  status: PaymentStatus
): Promise<ActionResult> {
  await requireAdminAction();

  try {
    await prisma.order.update({
      where: { id: orderId },
      data: { paymentStatus: status },
    });
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour du paiement." };
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { success: true };
}

export async function updateDeliveryStatus(
  orderId: string,
  status: DeliveryStatus
): Promise<ActionResult> {
  await requireAdminAction();

  let order;
  try {
    order = await prisma.order.update({
      where: { id: orderId },
      data: { deliveryStatus: status },
      include: { items: { include: { product: true } }, user: true },
    });
  } catch {
    return { success: false, error: "Erreur lors de la mise à jour de la livraison." };
  }

  if (status === "SHIPPED" || status === "DELIVERED") {
    try {
      await sendOrderStatusEmail(order, status);
    } catch (error) {
      console.error("[orders] échec de l'e-mail de statut :", error);
    }
  }

  revalidatePath("/admin/orders");
  revalidatePath(`/admin/orders/${orderId}`);
  revalidatePath("/admin");
  return { success: true };
}