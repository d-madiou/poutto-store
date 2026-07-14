import { ResetPasswordForm } from "@/components/store/reset-password-form";

export default function ResetPasswordPage() {
  return (
    <div className="container max-w-sm py-10">
      <h1 className="mb-6 text-center font-display text-2xl font-semibold text-foreground">
        Nouveau mot de passe
      </h1>
      <ResetPasswordForm />
    </div>
  );
}