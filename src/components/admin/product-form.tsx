"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { createProduct, updateProduct, type ProductInput } from "@/actions/product";
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

  const inputClass =
    "h-11 w-full rounded-xl border border-gray-200 bg-white px-4 text-sm font-medium text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#E07B39]/20 focus:border-[#E07B39] transition-colors";
  const labelClass =
    "block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5";
  const errorClass =
    "rounded-xl bg-red-50 border border-red-100 p-3 text-sm font-medium text-red-600";

  return (
    <form onSubmit={handleSubmit} className="space-y-5 max-w-xl mx-auto font-poppins">
      <div>
        <label htmlFor="name" className={labelClass}>
          Nom du produit
        </label>
        <input
          id="name"
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputClass}
          placeholder="Bonnet Poutou traditionnel"
        />
      </div>

      <div>
        <label htmlFor="slug" className={labelClass}>
          Slug{" "}
          <span className="font-normal text-gray-400">
            (laissez vide pour auto-générer)
          </span>
        </label>
        <input
          id="slug"
          type="text"
          value={slug}
          onChange={(e) => setSlug(e.target.value)}
          className={inputClass}
          placeholder="bonnet-poutou-labe"
        />
      </div>

      <div>
        <label htmlFor="category" className={labelClass}>
          Catégorie
        </label>
        <select
          id="category"
          required
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className={inputClass}
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor="description" className={labelClass}>
          Description
        </label>
        <textarea
          id="description"
          required
          rows={4}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className={`${inputClass} h-auto py-3 resize-none`}
          placeholder="Tissé main au Fouta-Djallon..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="price" className={labelClass}>
            Prix (GNF)
          </label>
          <input
            id="price"
            type="number"
            min="0"
            step="0.01"
            required
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="stock" className={labelClass}>
            Stock
          </label>
          <input
            id="stock"
            type="number"
            min="0"
            required
            value={stock}
            onChange={(e) => setStock(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Tailles disponibles</label>
        <TagInput values={sizes} onChange={setSizes} placeholder="ex. 56" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label htmlFor="color" className={labelClass}>
            Couleur
          </label>
          <input
            id="color"
            type="text"
            value={color}
            onChange={(e) => setColor(e.target.value)}
            className={inputClass}
          />
        </div>
        <div>
          <label htmlFor="region" className={labelClass}>
            Région
          </label>
          <input
            id="region"
            type="text"
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className={inputClass}
          />
        </div>
      </div>

      <div>
        <label className={labelClass}>Images</label>
        <ImageUploader images={images} onChange={setImages} />
      </div>

      {error && <div className={errorClass}>{error}</div>}

      <button
        type="submit"
        disabled={submitting}
        className="h-12 w-full rounded-xl bg-[#E07B39] text-white font-semibold text-sm transition-colors hover:bg-orange-600 disabled:opacity-60"
      >
        {submitting
          ? "Enregistrement…"
          : isEditing
          ? "Enregistrer les modifications"
          : "Créer le produit"}
      </button>
    </form>
  );
}