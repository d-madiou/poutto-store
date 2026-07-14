"use client";

import { useState } from "react";
import { requestPasswordReset } from "@/actions/auth";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

export function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    await requestPasswordReset(email);
    setSubmitting(false);
    setSent(true);
  }

  if (sent) {
    return (
      <div className="rounded-md border border-border bg-card p-4 text-center text-sm">
        <p className="font-medium text-foreground">E-mail envoyé</p>
        <p className="mt-1 text-muted-foreground">
          Si un compte existe avec cette adresse, un lien de réinitialisation
          vient d&apos;être envoyé. Vérifiez votre boîte e-mail.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-1.5">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          required
          autoComplete="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="h-12"
        />
      </div>

      <Button type="submit" size="lg" className="h-12 w-full" disabled={submitting}>
        {submitting ? "Envoi…" : "Envoyer le lien de réinitialisation"}
      </Button>
    </form>
  );
}