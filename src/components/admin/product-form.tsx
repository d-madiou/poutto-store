"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct, type ProductInput } from "@/actions/product";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/admin/image-uploader";
import { TagInput } from "@/components/admin/tag-input";

type Category = { id: string; name: string };

type ExistingProduct = {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  stock: number;
  images: string[];
  sizes: string[];
  color: string | null;
  region: string | null;
  categoryId: string;
};

export function ProductForm({
  categories,
  product,
}: {
  categories: Category[];
  product?: ExistingProduct;
}) {
  const router = useRouter();
  const isEditing = !!product;

  const [name, setName] = useState(product?.name ?? "");
  const [slug, setSlug] = useState(product?.slug ?? "");
  const [description, setDescription] = useState(product?.description ?? "");
  const [price, setPrice] = useState(product?.price?.toString() ?? "");
  const [stock, setStock] = useState(product?.stock?.toString() ?? "0");
  const [images, setImages] = useState<string[]>(product?.images ?? []);
  const [sizes, setSizes] = useState<string[]>(product?.sizes ?? []);
  const [color, setColor] = useState(product?.color ?? "");
  const [region, setRegion] = useState(product?.region ?? "");
  const [categoryId, setCategoryId] = useState(
    product?.categoryId ?? categories[0]?.id ?? ""
  );
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSubmitting(true);

    const input: ProductInput = {
      name,
      slug,
      description,
      price: parseFloat(price),
      stock: parseInt(stock, 10) || 0,
      images,
      sizes,
      color: color || undefined,
      region: region || undefined,
      categoryId,
    };

    const result = isEditing
      ? await updateProduct(product.id, input)
      : await createProduct(input);

    setSubmitting(false);

    if (!result.success) {
      setError(result.error);
      return;
    }

    toast.success(isEditing ? "Produit mis à jour" : "Produit créé");
    router.push("/admin/products");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="name">Nom du produit</Label>
        <Input
          id="name"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="slug">
          Identifiant URL (slug){" "}
          <span className="font-normal text-muted-foreground">
            — laisser vide pour générer automatiquement
          </span>
        </Label>
        <Input
          id="slug"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          placeholder="ex-poutou-de-labe-indigo"
        />
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="category">Catégorie</Label>
        <select
          id="category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="h-10 w-full rounded-md border border-input bg-card px-3 text-sm"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="description">Description</Label>
        <Textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="price">Prix (GNF)</Label>
          <Input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="stock">Stock</Label>
          <Input
            id="stock"
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Tailles disponibles</Label>
        <TagInput values={sizes} onChange={setSizes} placeholder="ex. 56" />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="color">Couleur</Label>
          <Input id="color" value={color} onChange={(e) => setColor(e.target.value)} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="region">Région</Label>
          <Input
            id="region"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
          />
        </div>
      </div>

      <div className="space-y-1.5">
        <Label>Images</Label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {error && (
        <p className="rounded-md bg-destructive/10 p-3 text-sm text-destructive">
          {error}
        </p>
      )}

      <Button type="submit" size="lg" className="h-12 w-full" disabled={submitting}>
        {submitting
          ? "Enregistrement…"
          : isEditing
          ? "Enregistrer les modifications"
          : "Créer le produit"}
      </Button>
    </form>
  );
}