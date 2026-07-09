"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth";

export type ProductInput = {
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  color?: string;
  region?: string;
  categoryId: string;
};

export type ActionResult =
  | { success: true }
  | { success: false; error: string };

function slugify(value: string): string {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // enlève les accents
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createProduct(input: ProductInput): Promise<ActionResult> {
  await requireAdminAction();

  if (!input.name.trim()) return { success: false, error: "Le nom est requis." };
  if (input.price <= 0) return { success: false, error: "Le prix doit être positif." };

  try {
    await prisma.product.create({
      data: {
        ...input,
        slug: input.slug.trim() || slugify(input.name),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Ce nom (ou identifiant URL) existe déjà." };
    }
    return { success: false, error: "Erreur lors de la création du produit." };
  }

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function updateProduct(
  id: string,
  input: ProductInput
): Promise<ActionResult> {
  await requireAdminAction();

  if (!input.name.trim()) return { success: false, error: "Le nom est requis." };
  if (input.price <= 0) return { success: false, error: "Le prix doit être positif." };

  try {
    await prisma.product.update({
      where: { id },
      data: {
        ...input,
        slug: input.slug.trim() || slugify(input.name),
      },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Ce nom (ou identifiant URL) existe déjà." };
    }
    return { success: false, error: "Erreur lors de la mise à jour du produit." };
  }

  revalidatePath("/admin/products");
  revalidatePath(`/products/${input.slug}`);
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function archiveProduct(id: string): Promise<ActionResult> {
  await requireAdminAction();

  await prisma.product.update({
    where: { id },
    data: { status: "ARCHIVED" },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function restoreProduct(id: string): Promise<ActionResult> {
  await requireAdminAction();

  await prisma.product.update({
    where: { id },
    data: { status: "ACTIVE" },
  });

  revalidatePath("/admin/products");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}