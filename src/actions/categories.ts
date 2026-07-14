"use server";

import { revalidatePath } from "next/cache";
import { prisma } from "@/lib/prisma";
import { requireAdminAction } from "@/lib/auth";
import { slugify } from "@/lib/slug";

export type ActionResult = { success: true } | { success: false; error: string };

export async function createCategory(name: string): Promise<ActionResult> {
  await requireAdminAction();

  if (!name.trim()) {
    return { success: false, error: "Le nom est requis." };
  }

  try {
    await prisma.category.create({
      data: { name: name.trim(), slug: slugify(name) },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Cette catégorie existe déjà." };
    }
    return { success: false, error: "Erreur lors de la création." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function renameCategory(id: string, name: string): Promise<ActionResult> {
  await requireAdminAction();

  if (!name.trim()) {
    return { success: false, error: "Le nom est requis." };
  }

  try {
    await prisma.category.update({
      where: { id },
      data: { name: name.trim(), slug: slugify(name) },
    });
  } catch (error) {
    if (error instanceof Error && error.message.includes("Unique constraint")) {
      return { success: false, error: "Cette catégorie existe déjà." };
    }
    return { success: false, error: "Erreur lors de la modification." };
  }

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}

export async function deleteCategory(id: string): Promise<ActionResult> {
  await requireAdminAction();

  const productCount = await prisma.product.count({ where: { categoryId: id } });
  if (productCount > 0) {
    return {
      success: false,
      error: `Impossible de supprimer : ${productCount} produit(s) utilisent encore cette catégorie.`,
    };
  }

  await prisma.category.delete({ where: { id } });

  revalidatePath("/admin/categories");
  revalidatePath("/products");
  revalidatePath("/");
  return { success: true };
}