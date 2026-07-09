import { whatsappLink } from "@/lib/whatsapp";

export function SiteFooter() {
  return (
     <footer className="hidden border-t border-border bg-secondary/40 md:block">
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
  );
}