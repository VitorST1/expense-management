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
      <header className="p-4 flex items-center justify-between bg-zinc-950 border-b border-zinc-700 shadow-lg sticky top-0 z-50">
        <div className="flex items-center gap-4">
          <Authenticated>
            <div className="md:hidden">
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:bg-zinc-800"
                  >
                    <Menu className="h-6 w-6" />
                    <span className="sr-only">Menu</span>
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="left"
                  className="w-[300px] sm:w-[400px] bg-zinc-950 border-zinc-800 text-white"
                >
                  <nav className="flex flex-col gap-5 px-4 mt-8">
                    <Link
                      to="/"
                      className="flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg hover:bg-zinc-800 hover:text-primary transition-all duration-200"
                      activeProps={{ className: "text-primary bg-zinc-800/50" }}
                      onClick={() => setIsOpen(false)}
                    >
                      <LayoutDashboard className="size-5" />
                      {m.home()}
                    </Link>
                    <Link
                      to="/categories"
                      className="flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg hover:bg-zinc-800 hover:text-primary transition-all duration-200"
                      activeProps={{ className: "text-primary bg-zinc-800/50" }}
                      onClick={() => setIsOpen(false)}
                    >
                      <Tags className="size-5" />
                      {m.categories()}
                    </Link>
                    <Link
                      to="/expenses"
                      className="flex items-center gap-3 px-4 py-3 text-lg font-semibold rounded-lg hover:bg-zinc-800 hover:text-primary transition-all duration-200"
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
        <div className="hidden md:flex justify-center flex-1">
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
            <Link
              to="/expenses"
              className="px-4 py-2 rounded-md hover:bg-zinc-800 transition-colors font-bold"
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
