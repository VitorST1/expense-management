import { useQuery } from "@tanstack/react-query"
import { convexQuery } from "@convex-dev/react-query"
import { api } from "convex/_generated/api"
import { DashboardStats } from "./DashboardStats"
import { DashboardCharts } from "./DashboardCharts"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card"
import { format } from "date-fns"
import { m } from "@/paraglide/messages"
import { DashboardSkeleton } from "./DashboardSkeleton"
import { Button } from "@/components/ui/button"
import { Link } from "@tanstack/react-router"
import { PlusCircle } from "lucide-react"
import { getLocale } from "@/paraglide/runtime.js"
import { enUS, ptBR } from "date-fns/locale"
import { formatCurrency } from "@/lib/utils.ts"

export default function Dashboard() {
  const { data: stats, isLoading } = useQuery(
    convexQuery(api.dashboard.getStats, {}),
  )

  if (isLoading || !stats) {
    return <DashboardSkeleton />
  }

  const hasExpensesThisMonth = stats.categoryStats.length > 0
  const avgDaily =
    stats.weeklyStats.reduce((acc, curr) => acc + curr.amount, 0) / 7

  if (!hasExpensesThisMonth) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center space-y-4 p-8 pt-6 min-h-[50vh]">
        <div className="flex flex-col items-center space-y-2 text-center">
          <h2 className="text-3xl font-bold tracking-tight">
            {m.dashboard_empty_state_title()}
          </h2>
          <p className="text-muted-foreground max-w-[600px]">
            {m.dashboard_empty_state_desc()}
          </p>
        </div>
        <Button asChild>
          <Link to="/expenses">
            <PlusCircle className="mr-2 h-4 w-4" />
            {m.add_first_expense()}
          </Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <h2 className="text-3xl font-bold tracking-tight">{m.dashboard()}</h2>
      <DashboardStats totalMonth={stats.totalMonth} avgDaily={avgDaily} />
      <DashboardCharts
        weeklyStats={stats.weeklyStats}
        categoryStats={stats.categoryStats}
      />
      <Card>
        <CardHeader>
          <CardTitle>{m.recent_activity()}</CardTitle>
          <CardDescription>{m.recent_transactions_desc()}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-8">
            {stats.recentActivity.map((expense) => (
              <div key={expense._id} className="flex items-center">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">
                    {expense.description || m.uncategorized_expense()}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {format(expense.date, "PPP", {
                      locale: getLocale() === "pt-br" ? ptBR : enUS,
                    })}{" "}
                    • {expense.categoryName}
                  </p>
                </div>
                <div className="ml-auto font-medium">
                  -{formatCurrency(expense.amount)}
                </div>
              </div>
            ))}
            {stats.recentActivity.length === 0 && (
              <p className="text-sm text-muted-foreground">
                {m.no_recent_activity()}
              </p>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
