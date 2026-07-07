import Link from "next/link";
import { User } from "lucide-react";
import { whatsappLink } from "@/lib/whatsapp";
import { CartProvider } from "@/lib/cart-context";
import { CartIcon } from "@/components/store/cart-icon";

export default function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <header className="sticky top-0 z-40 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="container flex h-16 items-center justify-between">
            <Link
              href="/"
              className="font-display text-xl font-semibold tracking-tight text-primary"
            >
              Poutou Store
            </Link>

            <nav className="flex items-center gap-1">
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

        <main className="flex-1">{children}</main>

        <footer className="border-t border-border bg-secondary/40">
          <div className="container flex flex-col gap-4 py-8 text-sm text-muted-foreground">
            <p className="font-display text-base text-foreground">Poutou Store</p>
            <p>
              Poutous traditionnels tissés et brodés à la main, directement du
              Fouta-Djallon.
            </p>
            
            {/* Fixed the missing "<a" tag below */}
            <a
              href={whatsappLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 w-fit items-center rounded-md bg-primary px-4 font-medium text-primary-foreground transition-opacity hover:opacity-90"
            >
              Nous contacter sur WhatsApp
            </a>
            
            <p className="text-xs">
              © {new Date().getFullYear()} Poutou Store. Tous droits réservés.
            </p>
          </div>
        </footer>
      </div>
    </CartProvider>
  );
}