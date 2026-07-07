import { LoginForm } from "@/components/store/login-form";

const ERROR_MESSAGES: Record<string, string> = {
  confirmation_failed:
    "Le lien de confirmation est invalide ou a expiré. Veuillez réessayer.",
};

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>;
}) {
  const { error } = await searchParams;
  const initialError = error ? ERROR_MESSAGES[error] : undefined;

  return (
    <div className="container max-w-sm py-10">
      <h1 className="mb-6 text-center font-display text-2xl font-semibold text-foreground">
        Connexion
      </h1>
      <LoginForm initialError={initialError} />
    </div>
  );
}