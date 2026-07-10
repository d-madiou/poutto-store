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

  if (pathname === "/cart" || pathname.startsWith("/checkout")) return null;

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 h-16 border-t border-gray-200 bg-white shadow-[0_-2px_10px_rgba(0,0,0,0.03)] md:hidden pb-safe font-poppins">
      <ul className="flex h-full items-stretch justify-around">
        {TABS.map((tab) => {
          const isActive = tab.exact
            ? pathname === tab.href
            : pathname.startsWith(tab.href);

          return (
            <li key={tab.href} className="relative flex flex-1">
              {/* Barre active orange en haut */}
              <div
                className={cn(
                  "absolute top-0 left-1/2 h-[3px] w-12 -translate-x-1/2 bg-[#E07B39] transition-all duration-200",
                  isActive ? "opacity-100" : "opacity-0"
                )}
              />

              <Link
                href={tab.href}
                className={cn(
                  "flex w-full flex-col items-center justify-center gap-1 transition-colors active:bg-gray-50",
                  isActive
                    ? "text-[#E07B39] font-semibold"
                    : "text-gray-500 hover:text-gray-800"
                )}
              >
                <div className="relative flex h-6 w-6 items-center justify-center">
                  <tab.icon
                    className={cn(
                      "h-5 w-5",
                      isActive ? "stroke-[2.5]" : "stroke-[1.75]"
                    )}
                  />

                  {tab.href === "/cart" && totalItems > 0 && (
                    <span className="absolute -top-1.5 -right-1.5 flex h-4 min-w-4 items-center justify-center rounded-sm bg-[#E07B39] px-1 font-sans text-[9px] font-bold leading-none text-white shadow-sm">
                      {totalItems > 9 ? "9+" : totalItems}
                    </span>
                  )}
                </div>

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