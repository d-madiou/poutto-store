"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, ShoppingBag, User, LayoutDashboard } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

export function MobileBottomNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Les pages panier/checkout ont déjà leur propre barre d'action fixe en bas —
  // éviter la superposition de deux barres fixes.
  if (pathname === "/cart" || pathname.startsWith("/checkout")) return null;

  const tabs = [
    { href: "/", label: "Accueil", icon: Home, exact: true },
    { href: "/products", label: "Collection", icon: Grid2x2, exact: false },
    { href: "/cart", label: "Panier", icon: ShoppingBag, exact: false },
    { href: "/account", label: "Compte", icon: User, exact: false },
    ...(isAdmin
      ? [{ href: "/admin", label: "Admin", icon: LayoutDashboard, exact: false }]
      : []),
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80 md:hidden">
      <ul className="flex items-stretch justify-around">
        {tabs.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <li key={tab.href} className="flex-1">
              <Link
                href={tab.href}
                className={cn(
                  "relative flex flex-col items-center gap-0.5 py-2.5 text-xs font-medium transition-colors",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                <tab.icon className="h-5 w-5" />
                {tab.label}
                {tab.href === "/cart" && totalItems > 0 && (
                  <span className="absolute right-[28%] top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-accent px-1 text-[10px] font-semibold leading-none text-accent-foreground">
                    {totalItems > 9 ? "9+" : totalItems}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}