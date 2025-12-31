import PopoverLanguage from "./PopoverLanguage"
import SignOutButton from "./auth/SignOutButton"
import { Authenticated } from "convex/react"
import { m } from "@/paraglide/messages.js"
import { Link } from "@tanstack/react-router"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"

import { useState } from "react"

export default function Header() {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <>
      <header className="p-4 flex items-center justify-between bg-zinc-950 border-b border-zinc-700 shadow-lg sticky top-0 z-50">
        <div></div>
        <Authenticated>
          <div className="flex items-center gap-4">
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
                      className="text-lg font-semibold hover:text-primary transition-colors"
                      activeProps={{ className: "text-primary" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {m.home()}
                    </Link>
                    <Link
                      to="/categories"
                      className="text-lg font-semibold hover:text-primary transition-colors"
                      activeProps={{ className: "text-primary" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {m.categories()}
                    </Link>
                    <Link
                      to="/expenses"
                      className="text-lg font-semibold hover:text-primary transition-colors"
                      activeProps={{ className: "text-primary" }}
                      onClick={() => setIsOpen(false)}
                    >
                      {m.expenses()}
                    </Link>
                  </nav>
                </SheetContent>
              </Sheet>
            </div>
          </div>
          <div className="hidden md:flex justify-center flex-1">
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
          </div>
        </Authenticated>
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
