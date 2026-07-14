import { ForgotPasswordForm } from "@/components/store/forgot-password-form";

export default function ForgotPasswordPage() {
  return (
    <div className="container max-w-sm py-10">
      <h1 className="mb-2 text-center font-display text-2xl font-semibold text-foreground">
        Mot de passe oublié
      </h1>
      <p className="mb-6 text-center text-sm text-muted-foreground">
        Entrez votre e-mail pour recevoir un lien de réinitialisation.
      </p>
      <ForgotPasswordForm />
    </div>
  );
}