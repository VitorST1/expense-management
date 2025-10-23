import { SignInWithPassword } from "@/components/auth/SignInWithPassword";
import { m } from "@/paraglide/messages"

export function SignInFormPassword() {
  return (
    <div className="max-w-sm mx-auto flex flex-col justify-center grow gap-4">
      <h2 className="font-semibold text-2xl tracking-tight">
        {m.sign_in_or_create_account()}
      </h2>
      <SignInWithPassword passwordRequirements={m.password_requirements()} />
    </div>
  );
}