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
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/products", label: "Produits", icon: Package },
  { href: "/admin/orders", label: "Commandes", icon: ShoppingCart },
  { href: "/admin/categories", label: "Catégories", icon: FolderTree },
  { href: "/admin/customers", label: "Clients", icon: Users },
  { href: "/admin/broadcast", label: "Email", icon: Mail },
];

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await requireAdminPage();

  return (
    <div className="min-h-screen bg-white font-poppins">
      {/* Structure principale : colonne sur mobile, ligne sur desktop */}
      <div className="flex flex-col md:flex-row">
        
        {/* Header mobile */}
        <header className="flex items-center justify-between border-b border-border bg-card px-4 py-3 md:hidden">
        <Link href="/admin" className="font-display text-lg font-semibold text-primary">
          Poutou Admin
        </Link>
        <div className="flex items-center gap-3">
          <Link href="/" className="text-sm font-medium text-primary">
            Boutique
          </Link>
          <form action={signOut}>
            <button className="text-sm font-medium text-muted-foreground">
              Déconnexion
            </button>
          </form>
        </div>
      </header>

        {/* Sidebar desktop (affichée uniquement sur md et +) */}
        <aside className="hidden md:flex md:w-56 md:shrink-0 md:flex-col md:border-r md:border-gray-200 md:bg-white">
          <div className="px-4 py-5 border-b border-gray-100">
            <Link href="/admin" className="text-lg font-bold text-gray-900">
              Poutou Admin
            </Link>
            <p className="mt-1 text-xs text-gray-500">{user.email}</p>
          </div>
          <ul className="flex-1 space-y-1 px-2 py-4">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="flex items-center gap-3 px-3 py-2.5 text-sm font-medium text-gray-600 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors"
                >
                  <item.icon className="h-4 w-4" />
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
          <div className="hidden space-y-1 px-2 py-4 md:block">
          <Link
            href="/"
            className="block rounded-md px-3 py-2.5 text-sm font-medium text-primary hover:bg-secondary"
          >
            ← Voir la boutique
          </Link>
          <form action={signOut}>
            <button className="w-full rounded-md px-3 py-2.5 text-left text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground">
              Déconnexion
            </button>
          </form>
        </div>
        </aside>

        {/* Contenu principal (unique) */}
        <main className="flex-1 px-4 py-4 pb-24 md:px-8 md:py-8">
          {children}
        </main>
      </div>

      {/* Bottom nav mobile */}
      <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-gray-200 bg-white md:hidden">
        <ul className="flex justify-around items-stretch h-16">
          {NAV_ITEMS.map((item) => (
            <li key={item.href} className="flex-1">
              <Link
                href={item.href}
                className="flex flex-col items-center justify-center h-full gap-1 text-gray-500 hover:text-[#E07B39] transition-colors"
              >
                <item.icon className="h-5 w-5" />
                <span className="text-[10px] font-semibold uppercase tracking-wider">
                  {item.label}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}