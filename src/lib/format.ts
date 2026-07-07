const CURRENCY = process.env.NEXT_PUBLIC_CURRENCY ?? "GNF";

/** Formate un montant dans la devise de la boutique (GNF par défaut, sans décimales). */
export function formatPrice(value: number | string): string {
  const n = typeof value === "string" ? Number(value) : value;
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency: CURRENCY,
      maximumFractionDigits: 0,
    }).format(n);
  } catch {
    return `${new Intl.NumberFormat("fr-FR").format(n)} ${CURRENCY}`;
  }
}

export function formatDate(date: Date | string): string {
  const d = typeof date === "string" ? new Date(date) : date;
  return new Intl.DateTimeFormat("fr-FR", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(d);
}

/** Référence courte lisible d'une commande à partir de son UUID. */
export function shortId(id: string): string {
  return id.split("-")[0].toUpperCase();
}
