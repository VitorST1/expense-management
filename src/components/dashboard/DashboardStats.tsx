import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { DollarSign, TrendingUp } from "lucide-react"
import { m } from "@/paraglide/messages"
import { formatCurrency } from "@/lib/utils"

interface DashboardStatsProps {
  totalMonth: number
  avgDaily: number
}

export function DashboardStats({ totalMonth, avgDaily }: DashboardStatsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-2">
      <Card className="relative overflow-hidden transition-all hover:shadow-md">
        <div className="absolute inset-0 bg-linear-to-br from-red-500/20 via-transparent to-transparent" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{m.total_spent_month()}</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/20 p-1.5">
            <DollarSign className="h-4 w-4 text-red-600 dark:text-red-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{formatCurrency(totalMonth)}</div>
          <p className="mt-1 text-xs text-muted-foreground">{m.for_current_month()}</p>
        </CardContent>
      </Card>
      <Card className="relative overflow-hidden transition-all hover:shadow-md">
        <div className="absolute inset-0 bg-linear-to-br from-blue-500/20 via-transparent to-transparent" />
        <CardHeader className="relative flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">{m.avg_daily_last_7_days()}</CardTitle>
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-500/20 p-1.5">
            <TrendingUp className="h-4 w-4 text-blue-600 dark:text-blue-400" />
          </div>
        </CardHeader>
        <CardContent className="relative">
          <div className="text-2xl font-bold">{formatCurrency(avgDaily)}</div>
          <p className="mt-1 text-xs text-muted-foreground">{m.average_per_day()}</p>
        </CardContent>
      </Card>
    </div>
  )
}
