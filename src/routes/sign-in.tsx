import { SignInWithPassword } from '@/components/auth/SignInWithPassword'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/sign-in')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SignInWithPassword />
}
