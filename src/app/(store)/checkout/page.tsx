import { getCurrentUser } from "@/lib/auth";
import { CheckoutClient } from "@/components/store/checkout-client";

export default async function CheckoutPage() {
  const user = await getCurrentUser();

  return (
    <div className="container py-6 pb-16">
      <h1 className="mb-6 font-display text-2xl font-semibold text-foreground">
        Finaliser la commande
      </h1>
      <CheckoutClient isLoggedIn={!!user} />
    </div>
  );
}