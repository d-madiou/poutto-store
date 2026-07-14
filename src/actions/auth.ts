"use server";

import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/prisma";

export type AuthResult = { success: true } | { success: false; error: string };

export async function signIn(email: string, password: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({ email, password });

  if (error) {
    return { success: false, error: "E-mail ou mot de passe incorrect." };
  }

  return { success: true };
}

export async function signUp(
  email: string,
  password: string,
  name: string
): Promise<AuthResult> {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      emailRedirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      data: { name },
    },
  });

  if (error) {
    return { success: false, error: "Impossible de créer le compte : " + error.message };
  }

  // Crée (ou met à jour) l'enregistrement Prisma correspondant.
  // Si un utilisateur admin a été pré-créé par le seed avec ce même e-mail,
  // on le retrouve ici plutôt que d'en créer un doublon.
  if (data.user) {
    await prisma.user.upsert({
      where: { email },
      update: { name },
      create: { email, name },
    });
  }

  return { success: true };
}

export async function signOut(): Promise<void> {
  const supabase = await createClient();
  await supabase.auth.signOut();
}

export async function requestPasswordReset(email: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback?next=/reset-password`,
  });

  if (error) {
    // On ne révèle jamais si l'e-mail existe ou non — toujours un succès apparent.
    console.error("[auth] échec de la demande de réinitialisation :", error.message);
  }

  return { success: true };
}

export async function updatePassword(newPassword: string): Promise<AuthResult> {
  const supabase = await createClient();

  const { error } = await supabase.auth.updateUser({ password: newPassword });

  if (error) {
    return { success: false, error: "Impossible de mettre à jour le mot de passe." };
  }

  return { success: true };
}