import Image from "next/image";
import Link from "next/link";
import { Star, ShoppingCart } from "lucide-react";
import { formatPrice } from "@/lib/format";
import type { StoreProduct } from "@/lib/serializers";

export function ProductCard({ product }: { product: StoreProduct }) {
  const outOfStock = product.stock <= 0;
  const image = product.images[0];

  // Simulated data for that highly addictive marketplace layout look
  const simulatedRating = 4.9;
  const simulatedSales = (product.stock * 7) + 12; 

  return (
    <div className="group relative flex flex-col rounded-xl border border-neutral-100 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-md overflow-hidden">
      
      {/* Visual Canvas Block */}
      <Link href={`/products/${product.slug}`} className="relative block aspect-square w-full bg-neutral-50">
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
          <div className="flex h-full items-center justify-center text-[11px] font-medium text-neutral-400">
            Aucune image
          </div>
        )}

        {/* Dynamic Promotional Ribbon Tag */}
        {outOfStock ? (
          <div className="absolute left-0 top-2 rounded-r-full bg-neutral-500 px-2.5 py-1 text-[10px] font-black tracking-wide text-white shadow-sm">
            Rupture
          </div>
        ) : product.stock <= 3 ? (
          <div className="absolute left-0 top-2 rounded-r-full bg-gradient-to-r from-amber-500 to-orange-600 px-2.5 py-1 text-[10px] font-black tracking-wide text-white shadow-sm animate-pulse">
            Stock Limité
          </div>
        ) : (
          <div className="absolute left-0 top-2 rounded-r-full bg-gradient-to-r from-red-500 to-pink-600 px-2.5 py-1 text-[10px] font-black tracking-wide text-white shadow-sm">
            Top Vente
          </div>
        )}

        {/* Region Flag Accent */}
        {product.region && (
          <span className="absolute right-2 top-2 rounded-md bg-black/5 px-1.5 py-0.5 text-[9px] font-semibold text-neutral-600 backdrop-blur-sm">
            {product.region}
          </span>
        )}
      </Link>

      {/* Conversion Focused Retail Metadata Feed */}
      <div className="flex flex-1 flex-col p-3">
        
        {/* Core Product Structural Name */}
        <Link href={`/products/${product.slug}`} className="block group-hover:text-amber-600 transition-colors">
          <h3 className="line-clamp-2 h-9 text-xs font-medium leading-tight text-neutral-800">
            {product.name}
          </h3>
        </Link>

        {/* Social Proof Indicator Metric Line */}
        <div className="mt-1.5 flex items-center gap-1.5 text-[11px]">
          <div className="flex items-center text-amber-500">
            <Star className="h-3 w-3 fill-current stroke-[1.5]" />
            <span className="ml-0.5 font-bold">{simulatedRating}</span>
          </div>
          <span className="text-neutral-300">|</span>
          <span className="text-neutral-500 font-medium">
            {simulatedSales}+ vendus
          </span>
        </div>

        {/* Pricing Layout Block */}
        <div className="mt-3 flex items-baseline gap-1">
          <span className="text-[11px] font-bold text-neutral-900 font-sans">GNF</span>
          <p className="text-base font-black tracking-tight text-neutral-900 font-sans">
            {formatPrice(product.price).replace("GNF", "").trim()}
          </p>
        </div>

        {/* Instant Checkout / Add CTA Module Line */}
        <div className="mt-3 pt-2 border-t border-neutral-100">
          <Link
            href={`/products/${product.slug}`}
            aria-disabled={outOfStock}
            className="flex w-full h-8 items-center justify-center gap-1.5 rounded-lg bg-amber-500 text-white text-xs font-bold transition-all active:scale-[0.98] hover:bg-amber-600 shadow-sm shadow-amber-500/10 disabled:pointer-events-none disabled:bg-neutral-200 disabled:text-neutral-400 disabled:shadow-none"
          >
            <ShoppingCart className="h-3.5 w-3.5 stroke-[2.5]" />
            <span>Acheter</span>
          </Link>
        </div>

      </div>
    </div>
  );
}