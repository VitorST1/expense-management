import { Link } from "@tanstack/react-router"
import { m } from "@/paraglide/messages"
import { Button } from "./ui/button"

export function NotFound({ children }: { children?: any }) {
  return (
    <div className="grow content-center space-y-2 self-center p-2">
      <div className="text-zinc-600 dark:text-zinc-300">
        {children || <p>{m.page_dont_exist()}</p>}
      </div>
      <p className="flex flex-wrap justify-center gap-2">
        <Button onClick={() => window.history.back()}>{m.go_back()}</Button>
        <Link to="/">
          <Button variant="outline">{m.start_over()}</Button>
        </Link>
      </p>
    </div>
  )
}
