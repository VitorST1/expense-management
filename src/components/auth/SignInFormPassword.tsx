import { SignInWithPassword } from "@/components/auth/SignInWithPassword"
import { m } from "@/paraglide/messages"

export function SignInFormPassword() {
  return (
    <div className="mx-auto flex max-w-sm grow flex-col justify-center gap-4">
      <h2 className="text-2xl font-semibold tracking-tight">{m.sign_in_or_create_account()}</h2>
      <SignInWithPassword passwordRequirements={m.password_requirements()} />
    </div>
  )
}
