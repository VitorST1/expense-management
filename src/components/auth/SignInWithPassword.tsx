import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { toast } from "sonner"
import { useState } from "react"
import { authClient } from "@/lib/auth-client"
import { useNavigate } from "@tanstack/react-router"
import { m } from "@/paraglide/messages"

export function SignInWithPassword({
  handlePasswordReset,
  customSignUp,
  passwordRequirements,
}: {
  handlePasswordReset?: () => void
  customSignUp?: React.ReactNode
  passwordRequirements?: string
}) {
  const navigate = useNavigate()
  const [flow, setFlow] = useState<"signIn" | "signUp">("signIn")
  const [submitting, setSubmitting] = useState(false)

  const signIn = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string

    try {
      const { data, error } = await authClient.signIn.email({
        email,
        password,
        callbackURL: "/",
        rememberMe: false,
      })
      console.log({ data, error })

      if (error) {
        console.error(error)
        toast.error(m.error_could_not_sign_in)
        setSubmitting(false)

        return
      }
    } catch (error) {
      console.error("123", error)
      toast.error(m.error_could_not_sign_in)
      setSubmitting(false)
    }

    navigate({ to: "/" })
  }

  const signUp = async (formData: FormData) => {
    const email = formData.get("email") as string
    const password = formData.get("password") as string
    const name = formData.get("name") as string

    try {
      const { data, error } = await authClient.signUp.email({
        email,
        password,
        name,
        callbackURL: "/",
      })
      console.log({ data, error })

      if (error) {
        let toastTitle: string

        switch (error.message) {
          case "User already exists. Use another email.":
            toastTitle = m.error_email_already_exists()
            break
          case "Invalid email":
            toastTitle = m.error_invalid_email()
            break
          case "Password too short":
            toastTitle = `${m.invalid_password()} - ${m.error_password_too_short()}`
            break
          case "Password too long":
            toastTitle = `${m.invalid_password()} - ${m.error_password_too_long()}`
            break
          default:
            toastTitle = m.error_could_not_sign_up()
            break
        }

        toast.error(toastTitle)
        setSubmitting(false)

        return
      }
    } catch (error) {
      console.error("123", error)
      toast.error(m.error_could_not_sign_up())
      setSubmitting(false)
    }

    navigate({ to: "/" })
  }
  return (
    <form
      className="flex flex-col"
      onSubmit={(event) => {
        event.preventDefault()
        setSubmitting(true)
        const formData = new FormData(event.currentTarget)

        if (flow === "signIn") {
          signIn(formData)
          return
        } else {
          signUp(formData)
          return
        }
      }}>
      {flow === "signUp" && (
        <>
          <label htmlFor="name">{m.name()}</label>
          <Input name="name" id="name" className="mb-4" />
        </>
      )}
      <label htmlFor="email">{m.email()}</label>
      <Input name="email" id="email" className="mb-4" autoComplete="email" />
      <div className="flex items-center justify-between">
        <label htmlFor="password">{m.password()}</label>
        {handlePasswordReset && flow === "signIn" ? (
          <Button
            className="p-0 h-auto"
            type="button"
            variant="link"
            onClick={handlePasswordReset}>
            {m.forgot_password()}
          </Button>
        ) : null}
      </div>
      <Input
        type="password"
        name="password"
        id="password"
        autoComplete={flow === "signIn" ? "current-password" : "new-password"}
      />
      {flow === "signUp" && passwordRequirements !== null && (
        <span className="text-zinc-400 font-thin text-sm">
          {passwordRequirements}
        </span>
      )}
      {flow === "signUp" && customSignUp}
      <input name="flow" value={flow} type="hidden" />
      <Button type="submit" disabled={submitting} className="mt-4">
        {flow === "signIn" ? m.sign_in() : m.sign_up()}
      </Button>
      <Button
        variant="link"
        type="button"
        onClick={() => {
          setFlow(flow === "signIn" ? "signUp" : "signIn")
        }}>
        {flow === "signIn"
          ? `${m.dont_have_an_account()} ${m.sign_up()}`
          : `${m.already_have_an_account()} ${m.sign_in()}`}
      </Button>
    </form>
  )
}
