"use server";

import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { sendOrderConfirmationEmail } from "@/lib/email";
import type { PaymentMethod } from "@prisma/client";

export type CheckoutItemInput = {
  productId: string;
  quantity: number;
};

export type CheckoutInput = {
  items: CheckoutItemInput[];
  deliveryAddress: string;
  paymentMethod: PaymentMethod;
  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;
};

export type CheckoutResult =
  | { success: true; orderId: string }
  | { success: false; error: string };

export async function createOrder(
  input: CheckoutInput
): Promise<CheckoutResult> {
  if (input.items.length === 0) {
    return { success: false, error: "Le panier est vide." };
  }
  if (!input.deliveryAddress?.trim()) {
    return { success: false, error: "L'adresse de livraison est requise." };
  }

  const user = await getCurrentUser();

  if (!user && !input.guestName?.trim()) {
    return { success: false, error: "Le nom est requis pour une commande invité." };
  }
  if (!user && !input.guestPhone?.trim()) {
    return { success: false, error: "Le numéro de téléphone est requis." };
  }

  try {
    const order = await prisma.$transaction(async (tx) => {
      // Verrouille les prix/stock actuels côté serveur — ne jamais faire
      // confiance aux prix envoyés par le client.
      const products = await tx.product.findMany({
        where: { id: { in: input.items.map((i) => i.productId) } },
      });

      const productMap = new Map(products.map((p) => [p.id, p]));

      let total = 0;
      for (const item of input.items) {
        const product = productMap.get(item.productId);
        if (!product || product.status !== "ACTIVE") {
          throw new Error(`Produit indisponible.`);
        }
        if (product.stock < item.quantity) {
          throw new Error(`Stock insuffisant pour "${product.name}".`);
        }
        total += Number(product.price) * item.quantity;
      }

      const createdOrder = await tx.order.create({
        data: {
          userId: user?.id ?? null,
          guestName: user ? null : input.guestName,
          guestPhone: user ? null : input.guestPhone,
          guestEmail: user ? null : input.guestEmail,
          deliveryAddress: input.deliveryAddress,
          paymentMethod: input.paymentMethod,
          total,
          items: {
            create: input.items.map((item) => {
              const product = productMap.get(item.productId)!;
              return {
                productId: item.productId,
                quantity: item.quantity,
                priceAtPurchase: product.price,
              };
            }),
          },
        },
        include: { items: { include: { product: true } }, user: true },
      });

      // Décrémente le stock pour chaque produit commandé.
      for (const item of input.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return createdOrder;
    });

    // L'e-mail ne doit jamais faire échouer la commande si Resend est absent/en erreur.
    try {
      await sendOrderConfirmationEmail(order);
    } catch (emailError) {
      console.error("[checkout] échec de l'e-mail de confirmation :", emailError);
    }

    return { success: true, orderId: order.id };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Une erreur est survenue.";
    return { success: false, error: message };
  }
}