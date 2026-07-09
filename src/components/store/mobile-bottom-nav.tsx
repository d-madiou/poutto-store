"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Grid2x2, ShoppingBag, User } from "lucide-react";
import { useCart } from "@/lib/cart-context";
import { cn } from "@/lib/utils";

const TABS = [
  { href: "/", label: "Accueil", icon: Home, exact: true },
  { href: "/products", label: "Collection", icon: Grid2x2, exact: false },
  { href: "/cart", label: "Panier", icon: ShoppingBag, exact: false },
  { href: "/account", label: "Compte", icon: User, exact: false },
];

export function MobileBottomNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  // Keep business logic exactly as provided
  if (pathname === "/cart" || pathname.startsWith("/checkout")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-border bg-background px-2 shadow-[0_-2px_10px_rgba(0,0,0,0.03)] md:hidden pb-safe">
      <ul className="flex h-full items-stretch justify-around">
        {TABS.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <li key={tab.href} className="relative flex flex-1">
              {/* Premium Active Indicator Bar — Pure corporate/marketplace grid structure */}
              <div
                className={cn(
                  "absolute top-0 left-1/2 h-[3px] w-12 -translate-x-1/2 bg-primary transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              <Link
                href={tab.href}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 transition-colors active:bg-secondary/40",
                  isActive
                    ? "text-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {/* Structural Icon Frame — Anchors the absolute position of the cart badge cleanly */}
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <tab.icon className={cn("h-5 w-5", isActive ? "stroke-[2.25]" : "stroke-[1.75]")} />
                  
                  {/* Cart Notification Badge anchored perfectly to the icon node */}
                  {tab.href === "/cart" && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-sm bg-accent px-1 font-mono text-[9px] font-black leading-none text-accent-foreground shadow-sm ring-2 ring-background animate-none">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>

                {/* Ultra-crisp Micro Typography Layout */}
                <span className="text-[9px] font-bold uppercase tracking-wider">
                  {tab.label}
                </span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}