import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/_authenticated/')({
  component: App,
})

function App() {
  const username = Route.useRouteContext()?.username?.replace(/^\w/, (c: string) => c.toUpperCase())
  return (
    <main className="flex flex-col items-center justify-center grow">
      <h1 className="text-3xl font-bold underline">Hello {username}!</h1>
    </main>
  )
}
