import { SignupForm } from "@/components/store/signup-form";

export default function SignupPage() {
  return (
    <div className="container max-w-sm py-10">
      <h1 className="mb-6 text-center font-display text-2xl font-semibold text-foreground">
        Créer un compte
      </h1>
      <SignupForm />
    </div>
  );
}