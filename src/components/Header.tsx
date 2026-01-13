import PopoverLanguage from "./PopoverLanguage"
import SignOutButton from "./auth/SignOutButton"
import { Authenticated } from "convex/react"
import { m } from "@/paraglide/messages.js"
import { Link } from "@tanstack/react-router"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Banknote, LayoutDashboard, Menu, Tags } from "lucide-react"

import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="sticky top-0 z-50 flex items-center justify-between border-b border-zinc-700 bg-zinc-950 px-8 py-4 shadow-lg">
        <div className="flex items-center gap-4">
          <Authenticated>
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="text-white hover:bg-zinc-800">
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] border-zinc-800 bg-zinc-950 text-white sm:w-[400px]"
                >
                  <nav className="mt-8 flex flex-col gap-5 px-4">
                    <Link
                      to="/"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 hover:bg-zinc-800 hover:text-primary"
                      activeProps={{ className: "text-primary bg-zinc-800/50" }}
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="size-5" />
                      {m.home()}
                    </Link>
                    <Link
                      to="/categories"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 hover:bg-zinc-800 hover:text-primary"
                      activeProps={{ className: "text-primary bg-zinc-800/50" }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Tags className="size-5" />
                      {m.categories()}
                    </Link>
                    <Link
                      to="/expenses"
                      className="flex items-center gap-3 rounded-lg px-4 py-3 text-lg font-semibold transition-all duration-200 hover:bg-zinc-800 hover:text-primary"
                      activeProps={{ className: "text-primary bg-zinc-800/50" }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Banknote className="size-5" />
                      {m.expenses()}
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </Authenticated>
        </div>
        <div className="hidden flex-1 justify-center md:flex">
          <Authenticated>
            <Link
              to="/"
              className="rounded-md px-4 py-2 font-bold transition-colors hover:bg-zinc-800"
            >
              {m.home()}
            </Link>
            <Link
              to="/categories"
              className="rounded-md px-4 py-2 font-bold transition-colors hover:bg-zinc-800"
              activeProps={{
                className: "underline",
              }}
            >
              {m.categories()}
            </Link>
            <Link
              to="/expenses"
              className="rounded-md px-4 py-2 font-bold transition-colors hover:bg-zinc-800"
              activeProps={{
                className: "underline",
              }}
            >
              {m.expenses()}
            </Link>
          </Authenticated>
        </div>
        <div className="flex items-center gap-4">
          <PopoverLanguage />
          <Authenticated>
            <SignOutButton />
          </Authenticated>
        </div>
      </header>
    </>
  )
}
