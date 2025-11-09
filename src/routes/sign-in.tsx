import { SignInFormPassword } from "@/components/auth/SignInFormPassword"
import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/sign-in")({
  validateSearch: (search) => ({
    redirect: (search.redirect as string) || "/",
  }),
  beforeLoad: ({ context, search }) => {
    // Redirect if already authenticated
    if (context.userId) {
      throw redirect({ to: search.redirect })
    }
  },
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInFormPassword />
}
