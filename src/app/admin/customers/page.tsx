import { prisma } from "@/lib/prisma";
import { formatDate } from "@/lib/format";
import { Badge } from "@/components/ui/badge";

export default async function AdminCustomersPage() {
  const customers = await prisma.user.findMany({
    where: { role: "CUSTOMER" },
    orderBy: { createdAt: "desc" },
    include: { _count: { select: { orders: true } } },
  });

  return (
    <div>
      <h1 className="font-display text-2xl font-semibold text-foreground">
        Clients
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        {customers.length} client{customers.length > 1 ? "s" : ""} inscrit
        {customers.length > 1 ? "s" : ""}
      </p>

      {customers.length === 0 ? (
        <p className="mt-8 rounded-lg border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
          Aucun client inscrit pour le moment.
        </p>
      ) : (
        <ul className="mt-4 divide-y divide-border rounded-lg border border-border bg-card">
          {customers.map((customer) => (
            <li key={customer.id} className="flex items-center justify-between gap-3 p-4">
              <div className="min-w-0">
                <p className="truncate text-sm font-medium text-foreground">
                  {customer.name ?? "Sans nom"}
                </p>
                <p className="truncate text-xs text-muted-foreground">
                  {customer.email}
                  {customer.phone ? ` · ${customer.phone}` : ""}
                </p>
                <p className="text-xs text-muted-foreground">
                  Inscrit le {formatDate(customer.createdAt)}
                </p>
              </div>
              <Badge variant="secondary" className="shrink-0">
                {customer._count.orders} commande
                {customer._count.orders > 1 ? "s" : ""}
              </Badge>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}