// Libellés FR partagés (client + serveur). Les statuts circulent comme des
// chaînes — ne pas importer les enums Prisma dans les composants client.

export const PAYMENT_METHOD_LABELS: Record<string, string> = {
  CASH: "Espèces à la livraison",
  ORANGE_MONEY: "Orange Money",
};

export const PAYMENT_STATUS_LABELS: Record<string, string> = {
  PENDING: "Paiement en attente",
  CONFIRMED: "Payée",
};

export const DELIVERY_STATUS_LABELS: Record<string, string> = {
  PROCESSING: "En préparation",
  SHIPPED: "Expédiée",
  DELIVERED: "Livrée",
  CANCELLED: "Annulée",
};

export const PAYMENT_STATUS_OPTIONS = ["PENDING", "CONFIRMED"] as const;
export const DELIVERY_STATUS_OPTIONS = [
  "PROCESSING",
  "SHIPPED",
  "DELIVERED",
  "CANCELLED",
] as const;
