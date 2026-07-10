import Image from "next/image";
import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/serializers";

export function ProductCard({ product }: { product: StoreProduct }) {
  const outOfStock = product.stock <= 0;
  const image = product.images[0];

  return (
    <div className="group relative flex flex-col rounded-xl border border-gray-100 bg-white transition-all duration-200 hover:border-gray-300 font-poppins">
      
      {/* Image */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square w-full bg-gray-50 overflow-hidden rounded-t-xl">
        {image ? (
          <div className="relative h-full w-full p-4">
            <Image
              src={image}
              alt={product.name}
              fill
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
              className="object-contain"
              priority
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-xs font-medium text-gray-400">
            Aucune image
          </div>
        )}

        {/* Badges basés sur des données réelles uniquement */}
        {outOfStock ? (
          <div className="absolute left-2 top-2 rounded-full bg-gray-200 px-2.5 py-1 text-[10px] font-semibold text-gray-600">
            Rupture
          </div>
        ) : product.stock <= 3 && product.stock > 0 ? (
          <div className="absolute left-2 top-2 rounded-full bg-[#E07B39] px-2.5 py-1 text-[10px] font-semibold text-white">
            Stock limité
          </div>
        ) : null}

        {product.region && (
          <span className="absolute right-2 top-2 rounded-full bg-white/80 backdrop-blur-sm px-2 py-0.5 text-[9px] font-semibold text-gray-700 border border-gray-200">
            {product.region}
          </span>
        )}
      </Link>

      {/* Contenu */}
      <div className="flex flex-1 flex-col p-3">
        
        {/* Nom du produit */}
        <Link href={`/products/${product.slug}`} className="block">
          <h3 className="line-clamp-2 h-9 text-xs font-semibold leading-tight text-gray-900">
            {product.name}
          </h3>
        </Link>

        {/* Catégorie (si présente) */}
        {product.category?.name && (
          <span className="mt-1 inline-block text-[10px] font-medium text-gray-500 uppercase tracking-wide">
            {product.category.name}
          </span>
        )}

        {/* Prix */}
        <div className="mt-auto pt-3">
          <p className="text-lg font-bold tracking-tight text-gray-900">
            {formatPrice(product.price)}
          </p>
        </div>

        {/* Bouton d'achat */}
        <Link
          href={`/products/${product.slug}`}
          aria-disabled={outOfStock}
          className={`mt-3 flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-semibold transition-colors ${
            outOfStock
              ? "bg-gray-100 text-gray-400 pointer-events-none"
              : "bg-[#E07B39] text-white hover:bg-orange-600 active:bg-[#c96c2e]"
          }`}
        >
          <ShoppingCart className="h-4 w-4 stroke-[2.5]" />
          <span>{outOfStock ? "Indisponible" : "Acheter"}</span>
        </Link>
      </div>
    </div>
  );
}