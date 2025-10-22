import { createFileRoute, redirect } from '@tanstack/react-router'

export const Route = createFileRoute('/')({
  component: App,
  loader: async ({ context }) => {
    if (!context.userId) {
      throw redirect({ to: '/sign-in' })
    }

    return {
      userId: context.userId,
      username: context.username
    }
  },
})

function App() {
  const username = Route.useLoaderData()?.username?.replace(/^\w/, (c) => c.toUpperCase())
  return (
    <main className="flex flex-col items-center justify-center grow">
      <h1 className="text-3xl font-bold underline">Hello {username}!</h1>
    </main>
  )
}
