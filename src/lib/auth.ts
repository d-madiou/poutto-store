import { cache } from "react";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { createClient, isSupabaseConfigured } from "@/lib/supabase/server";

/** Utilisateur Supabase Auth de la session courante (ou null). */
export async function getAuthUser() {
  if (!isSupabaseConfigured()) return null;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user;
}

/**
 * Utilisateur applicatif (table Prisma `User`), relié au compte Supabase par
 * l'e-mail (unique des deux côtés). Mis en cache par requête.
 */
export const getCurrentUser = cache(async () => {
  const authUser = await getAuthUser();
  if (!authUser?.email) return null;
  return prisma.user.findUnique({ where: { email: authUser.email } });
});

/** Garde de page : redirige si non connecté ou non admin. */
export async function requireAdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/login?next=/admin");
  if (user.role !== "ADMIN") redirect("/");
  return user;
}

/** Garde de server action : lève une erreur si non admin. */
export async function requireAdminAction() {
  const user = await getCurrentUser();
  if (!user || user.role !== "ADMIN") {
    throw new Error("Accès refusé : réservé aux administrateurs.");
  }
  return user;
}
