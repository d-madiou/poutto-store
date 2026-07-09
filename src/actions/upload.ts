"use server";

import { randomUUID } from "crypto";
import { requireAdminAction } from "@/lib/auth";
import { createAdminClient, STORAGE_BUCKET } from "@/lib/supabase/admin";

export type UploadResult =
  | { success: true; url: string }
  | { success: false; error: string };

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5 Mo
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];

export async function uploadProductImage(formData: FormData): Promise<UploadResult> {
  await requireAdminAction();

  const file = formData.get("file");
  if (!(file instanceof File)) {
    return { success: false, error: "Aucun fichier reçu." };
  }
  if (!ALLOWED_TYPES.includes(file.type)) {
    return { success: false, error: "Format non supporté (JPEG, PNG ou WebP uniquement)." };
  }
  if (file.size > MAX_FILE_SIZE) {
    return { success: false, error: "Image trop volumineuse (5 Mo maximum)." };
  }

  const supabase = createAdminClient();
  const extension = file.name.split(".").pop() || "jpg";
  const path = `products/${randomUUID()}.${extension}`;

  const buffer = Buffer.from(await file.arrayBuffer());

  const { error } = await supabase.storage
    .from(STORAGE_BUCKET)
    .upload(path, buffer, { contentType: file.type, upsert: false });

  if (error) {
    return { success: false, error: "Échec de l'envoi de l'image." };
  }

  const { data } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(path);

  return { success: true, url: data.publicUrl };
}

export async function deleteProductImage(url: string): Promise<void> {
  await requireAdminAction();

  const supabase = createAdminClient();
  const marker = `/${STORAGE_BUCKET}/`;
  const idx = url.indexOf(marker);
  if (idx === -1) return;

  const path = url.slice(idx + marker.length);
  await supabase.storage.from(STORAGE_BUCKET).remove([path]);
}