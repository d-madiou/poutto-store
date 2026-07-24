import { getCurrentUser } from "@/lib/auth";
import { CartProvider } from "@/lib/cart-context";
import { SiteHeader } from "@/components/store/site-header";
import { SiteFooter } from "@/components/store/site-footer";
import { MobileBottomNav } from "@/components/store/mobile-bottom-nav";

export default async function StoreLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();
  const isAdmin = user?.role === "ADMIN";

  return (
    <CartProvider>
      <div className="flex min-h-screen flex-col">
        <SiteHeader isAdmin={isAdmin} />
        <main className="flex-1 pb-16 md:pb-0">{children}</main>
        <SiteFooter />
        <MobileBottomNav isAdmin={isAdmin} />
      </div>
    </CartProvider>
  );
}