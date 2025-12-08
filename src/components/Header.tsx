import PopoverLanguage from "./PopoverLanguage"
import SignOutButton from "./auth/SignOutButton"
import { Authenticated } from "convex/react"
import { m } from "@/paraglide/messages.js"
import { Link } from "@tanstack/react-router"

export default function Header() {
  return (
    <>
      <header className="p-4 grid grid-cols-3 items-center bg-zinc-950 border-b border-zinc-700 text-white shadow-lg">
        <div></div>
        <div className="flex justify-center">
          <Authenticated>
            <Link
              to="/"
              className="px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors font-bold"
            >
              {m.home()}
            </Link>
            <Link
              to="/categories"
              className="px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors font-bold"
              activeProps={{
                className: "underline",
              }}
            >
              {m.categories()}
            </Link>
          </Authenticated>
        </div>
        <div className="flex items-center justify-end-safe gap-4">
          <PopoverLanguage />
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>
    </>
  )
}
