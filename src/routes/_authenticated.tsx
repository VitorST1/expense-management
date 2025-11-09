import { createFileRoute, redirect } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated")({
  beforeLoad: ({ context, location }) => {
    if (!context.userId) {
      throw redirect({
        to: "/sign-in",
        search: {
          // Save current location for redirect after login
          redirect: location.href,
        },
      })
    }
  },
})
