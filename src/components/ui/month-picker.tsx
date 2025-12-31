import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useState } from "react"
import { format, setMonth as setDateMonth, setYear } from "date-fns"
import { getLocale } from "@/paraglide/runtime"
import { ptBR, enUS } from "date-fns/locale"
import { capitalize } from "@/lib/utils"

interface MonthPickerProps {
  currentMonth: Date
  onMonthChange: (date: Date) => void
}

export function MonthPicker({ currentMonth, onMonthChange }: MonthPickerProps) {
  const [viewYear, setViewYear] = useState(currentMonth.getFullYear())
  const locale = getLocale() === "pt-br" ? ptBR : enUS

  const months = Array.from({ length: 12 }, (_, i) => {
    return setDateMonth(new Date(viewYear, 0, 1), i)
  })

  return (
    <div className="p-3">
      <div className="flex items-center justify-between mb-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewYear(viewYear - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <div className="font-semibold">{viewYear}</div>
        <Button
          variant="outline"
          size="icon"
          onClick={() => setViewYear(viewYear + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="grid grid-cols-3 gap-2">
        {months.map((month) => (
          <Button
            key={month.toString()}
            variant={
              month.getMonth() === currentMonth.getMonth() &&
              month.getFullYear() === currentMonth.getFullYear()
                ? "default"
                : "ghost"
            }
            onClick={() => {
              const newDate = setYear(
                setDateMonth(currentMonth, month.getMonth()),
                viewYear,
              )
              onMonthChange(newDate)
            }}
          >
            {capitalize(format(month, "MMM", { locale }))}
          </Button>
        ))}
      </div>
    </div>
  )
}
