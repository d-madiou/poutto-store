import { notFound } from "next/navigation";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import { serializeProduct } from "@/lib/serializers";
import { formatPrice } from "@/lib/format";
import { ProductPurchasePanel } from "@/components/store/product-purchase-panel";

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const product = await prisma.product.findUnique({
    where: { slug },
    include: { category: true },
  });

  if (!product || product.status !== "ACTIVE") notFound();

  const storeProduct = serializeProduct(product);
  const attributes = [
    {
      label: "Tailles",
      value: storeProduct.sizes.length > 0 ? storeProduct.sizes.join(", ") : null,
    },
    { label: "Couleur", value: storeProduct.color },
    { label: "Région", value: storeProduct.region },
  ].filter((a) => a.value);

  return (
    <div className="bg-white min-h-screen pb-24 font-poppins">
      <div className="container max-w-7xl mx-auto px-4 py-6 md:py-10">
        <div className="grid gap-8 md:grid-cols-2 md:gap-12">
          
          {/* Galerie d'images */}
          <div className="space-y-3">
            <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-gray-50">
              {storeProduct.images[0] ? (
                <Image
                  src={storeProduct.images[0]}
                  alt={storeProduct.name}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  priority
                  className="object-contain p-4"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-gray-400">
                  Pas d&apos;image
                </div>
              )}
            </div>

            {storeProduct.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {storeProduct.images.slice(1).map((img, i) => (
                  <div
                    key={img + i}
                    className="relative aspect-square overflow-hidden rounded-lg bg-gray-50"
                  >
                    <Image
                      src={img}
                      alt={`${storeProduct.name} – Image ${i + 2}`}
                      fill
                      sizes="25vw"
                      className="object-contain p-2"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Détails */}
          <div className="space-y-5">
            {storeProduct.category && (
              <span className="inline-block text-xs font-semibold uppercase tracking-wider text-[#E07B39] bg-[#E07B39]/10 px-3 py-1 rounded-full">
                {storeProduct.category.name}
              </span>
            )}

            <h1 className="text-2xl font-bold text-gray-900 leading-tight sm:text-3xl">
              {storeProduct.name}
            </h1>

            {/* Prix en orange – capte l’attention immédiatement */}
            <div className="flex items-baseline gap-1.5 mt-1">
              <span className="text-sm font-semibold text-[#E07B39] uppercase tracking-wider">
                GNF
              </span>
              <span className="text-4xl font-extrabold tracking-tight text-[#E07B39]">
                {formatPrice(storeProduct.price).replace("GNF", "").trim()}
              </span>
            </div>

            {/* Stock */}
            {storeProduct.stock <= 0 ? (
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-600">
                Épuisé
              </div>
            ) : storeProduct.stock <= 3 ? (
              <div className="inline-flex items-center rounded-full bg-[#E07B39]/10 px-3 py-1 text-xs font-semibold text-[#E07B39]">
                Plus que {storeProduct.stock} en stock
              </div>
            ) : (
              <div className="inline-flex items-center rounded-full bg-gray-100 px-3 py-1 text-xs font-semibold text-gray-700">
                En stock
              </div>
            )}

            {/* Description */}
            {storeProduct.description && (
              <p className="text-sm text-gray-600 leading-relaxed whitespace-pre-line">
                {storeProduct.description}
              </p>
            )}

            {/* Attributs */}
            {attributes.length > 0 && (
              <dl className="grid grid-cols-2 gap-3 rounded-xl border border-gray-200 bg-gray-50 p-4 text-sm">
                {attributes.map((attr) => (
                  <div key={attr.label}>
                    <dt className="text-xs font-medium text-gray-500 uppercase tracking-wider">
                      {attr.label}
                    </dt>
                    <dd className="mt-0.5 font-semibold text-gray-800">
                      {attr.value}
                    </dd>
                  </div>
                ))}
              </dl>
            )}

            {/* Panneau d’achat */}
            <ProductPurchasePanel product={storeProduct} />
          </div>
        </div>
      </div>
    </div>
  );
}