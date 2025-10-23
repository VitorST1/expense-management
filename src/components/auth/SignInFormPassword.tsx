import { SignInWithPassword } from "@/components/auth/SignInWithPassword";

export function SignInFormPassword() {
  return (
    <div className="max-w-sm mx-auto flex flex-col justify-center grow gap-4">
      <h2 className="font-semibold text-2xl tracking-tight">
        Sign in or create an account
      </h2>
      <SignInWithPassword passwordRequirements="At least 8 characters long" />
    </div>
  );
}