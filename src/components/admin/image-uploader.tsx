"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import { toast } from "sonner";
import { Loader2, Upload, X } from "lucide-react";
import { uploadProductImage, deleteProductImage } from "@/actions/upload";

export function ImageUploader({
  images,
  onChange,
}: {
  images: string[];
  onChange: (images: string[]) => void;
}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  async function handleFiles(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);

    const newUrls: string[] = [];
    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.set("file", file);
      const result = await uploadProductImage(formData);
      if (!result.success) {
        toast.error(result.error);
        continue;
      }
      newUrls.push(result.url);
    }

    setUploading(false);
    if (newUrls.length > 0) {
      onChange([...images, ...newUrls]);
      toast.success(
        newUrls.length > 1 ? `${newUrls.length} images ajoutées` : "Image ajoutée"
      );
    }
    if (inputRef.current) inputRef.current.value = "";
  }

  async function handleRemove(url: string) {
    onChange(images.filter((img) => img !== url));
    deleteProductImage(url).catch(() => {
      // Suppression du fichier distant en tâche de fond — l'UI reste réactive
      // même si le nettoyage échoue silencieusement.
    });
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
        {images.map((url) => (
          <div
            key={url}
            className="group relative aspect-square overflow-hidden rounded-md bg-secondary"
          >
            <Image src={url} alt="" fill sizes="120px" className="object-cover" />
            <button
              type="button"
              aria-label="Retirer cette image"
              onClick={() => handleRemove(url)}
              className="absolute right-1 top-1 flex h-7 w-7 items-center justify-center rounded-full bg-background/90 text-foreground shadow-sm"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}

        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          className="flex aspect-square flex-col items-center justify-center gap-1 rounded-md border-2 border-dashed border-border text-muted-foreground hover:border-primary hover:text-primary disabled:opacity-50"
        >
          {uploading ? (
            <Loader2 className="h-5 w-5 animate-spin" />
          ) : (
            <>
              <Upload className="h-5 w-5" />
              <span className="text-xs">Ajouter</span>
            </>
          )}
        </button>
      </div>

      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        multiple
        capture="environment"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
      />
    </div>
  );
}