import { Button } from "@/components/ui/button"
import { MonthPicker } from "@/components/ui/month-picker"
import { Input } from "@/components/ui/input"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { m } from "@/paraglide/messages"
import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "convex/_generated/api"
import { CalendarIcon, XIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { Id } from "convex/_generated/dataModel"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import { Check, ChevronsUpDown } from "lucide-react"
import { useState } from "react"
import { getLocale } from "@/paraglide/runtime"
import { ptBR, enUS } from "date-fns/locale"
import { capitalize } from "@/lib/utils"

interface ExpenseFiltersProps {
  search: string
  setSearch: (value: string) => void
  category: Id<"categories"> | undefined
  setCategory: (value: Id<"categories"> | undefined) => void
  month: Date | undefined
  setMonth: (value: Date | undefined) => void
}

export function ExpenseFilters({
  search,
  setSearch,
  category,
  setCategory,
  month,
  setMonth,
}: ExpenseFiltersProps) {
  const { data: categories } = useQuery(convexQuery(api.categories.get, {}))
  const [openCategory, setOpenCategory] = useState(false)
  const [openDate, setOpenDate] = useState(false)

  const locale = getLocale() === "pt-br" ? ptBR : enUS

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <Input
        placeholder={m.search()}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="w-full"
      />

      <Popover open={openCategory} onOpenChange={setOpenCategory}>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            role="combobox"
            aria-expanded={openCategory}
            className="w-full justify-between"
          >
            {category
              ? categories?.find((c) => c._id === category)?.name
              : m.select_category()}
            <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
          </Button>
        </PopoverTrigger>
        <PopoverContent className="p-0" align="start">
          <Command>
            <CommandInput placeholder={m.search()} />
            <CommandList>
              <CommandEmpty>{m.no_results_found()}</CommandEmpty>
              <CommandGroup>
                <CommandItem
                  value="all"
                  onSelect={() => {
                    setCategory(undefined)
                    setOpenCategory(false)
                  }}
                >
                  <Check
                    className={cn(
                      "mr-2 h-4 w-4",
                      !category ? "opacity-100" : "opacity-0",
                    )}
                  />
                  {m.all_categories()}
                </CommandItem>
                {categories?.map((c) => (
                  <CommandItem
                    key={c._id}
                    value={c.name}
                    onSelect={() => {
                      setCategory(c._id)
                      setOpenCategory(false)
                    }}
                  >
                    <Check
                      className={cn(
                        "mr-2 h-4 w-4",
                        category === c._id ? "opacity-100" : "opacity-0",
                      )}
                    />
                    {c.name}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <div className="relative">
        <Popover open={openDate} onOpenChange={setOpenDate}>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal pr-10",
                !month && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {month ? (
                capitalize(format(month, "MMMM yyyy", { locale }))
              ) : (
                <span>{m.select_month()}</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <MonthPicker
              currentMonth={month || new Date()}
              onMonthChange={(date) => {
                setMonth(date)
                setOpenDate(false)
              }}
            />
          </PopoverContent>
        </Popover>
        {month && (
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full w-10 hover:bg-transparent"
            onClick={(e) => {
              e.stopPropagation()
              setMonth(undefined)
            }}
          >
            <XIcon className="h-4 w-4 text-muted-foreground hover:text-foreground" />
          </Button>
        )}
      </div>
    </div>
  )
}
