import Link from "next/link";
import { User, LayoutDashboard } from "lucide-react";
import { CartIcon } from "@/components/store/cart-icon";

export function SiteHeader({ isAdmin }: { isAdmin: boolean }) {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
      <div className="container flex h-16 items-center justify-between">
        <Link
          href="/"
          className="font-display text-xl font-semibold tracking-tight text-primary"
        >
          Poutou Store
        </Link>

        {/* Icônes visibles uniquement sur grand écran — sur mobile,
            ces actions vivent dans la barre d'onglets du bas. */}
        <nav className="hidden items-center gap-1 md:flex">
          {isAdmin && (
            <Link
              href="/admin"
              className="flex h-11 items-center gap-1.5 rounded-full px-3 text-sm font-medium text-primary transition-colors hover:bg-secondary"
            >
              <LayoutDashboard className="h-4 w-4" />
              Admin
            </Link>
          )}
          <Link
            href="/account"
            aria-label="Mon compte"
            className="flex h-11 w-11 items-center justify-center rounded-full text-foreground/80 transition-colors hover:bg-secondary hover:text-foreground"
          >
            <User className="h-5 w-5" />
          </Link>
          <CartIcon />
        </nav>
      </div>
    </header>
  );
}