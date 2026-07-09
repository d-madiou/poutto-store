import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  FolderTree,
  Users,
  Mail,
} from "lucide-react";
import { requireAdminPage } from "@/lib/auth";
import { signOut } from "@/actions/auth";

const NAV_ITEMS = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/broadcast", label: "E-mail groupé", icon: Mail },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage();

  return (
    <div className="flex min-h-screen flex-col md:flex-row">
      {/* Mobile top bar */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-lg font-semibold text-primary">
          Poutou Admin
        </Link>
        <form action={signOut}>
          <button className="text-sm font-medium text-muted-foreground">
            Déconnexion
          </button>
        </form>
      </header>

      {/* Sidebar (desktop) / bottom tab bar (mobile) */}
      <nav className="order-2 border-t border-border bg-card md:order-1 md:w-56 md:shrink-0 md:border-r md:border-t-0">
        <div className="hidden px-4 py-5 md:block">
          <span className="font-display text-lg font-semibold text-primary">
            Poutou Admin
          </span>
          <p className="mt-1 text-xs text-muted-foreground">{user.email}</p>
        </div>

        <ul className="flex justify-around md:flex-col md:justify-start md:gap-1 md:px-2">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="flex-1 md:flex-none">
              <Link
                href={item.href}
                className="flex flex-col items-center gap-1 px-2 py-2.5 text-xs font-medium text-muted-foreground hover:bg-secondary hover:text-foreground md:flex-row md:justify-start md:gap-3 md:rounded-md md:px-3 md:py-2.5 md:text-sm"
              >
                <item.icon className="h-5 w-5 md:h-4 md:w-4" />
                <span className="md:inline">{item.label}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="hidden px-2 py-4 md:block">
          <form action={signOut}>
            <button className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
              Déconnexion
            </button>
          </form>
        </div>
      </nav>

      <main className="order-1 flex-1 px-4 py-6 md:order-2 md:px-8 md:py-8">
        {children}
      </main>
    </div>
  );
}