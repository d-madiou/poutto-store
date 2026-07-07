const PHONE = process.env.NEXT_PUBLIC_WHATSAPP_PHONE ?? "";

/** Lien wa.me pré-rempli. `productName` optionnel pour un message générique. */
export function whatsappLink(productName?: string, productUrl?: string): string {
  const text = productName
    ? `Bonjour, je suis intéressé par « ${productName} »${productUrl ? ` (${productUrl})` : ""}. Est-il disponible ?`
    : "Bonjour, je vous contacte depuis la boutique Poutou Store.";
  return `https://wa.me/${PHONE}?text=${encodeURIComponent(text)}`;
}
