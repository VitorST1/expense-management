import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { m } from "@/paraglide/messages"
import { getLocale } from "@/paraglide/runtime"
import { formatCurrency } from "@/lib/utils"

interface WeeklyStat {
  date: number
  amount: number
  [key: string]: any
}

interface CategoryStat {
  name: string
  amount: number
  fill: string
  [key: string]: any
}

interface DashboardChartsProps {
  weeklyStats: WeeklyStat[]
  categoryStats: CategoryStat[]
}

function CustomTooltip({ active, payload, label }: any) {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border bg-popover p-2 shadow-sm">
        <div className="grid grid-cols-2 gap-2">
          <div className="flex flex-col">
            <span className="text-[0.70rem] uppercase text-muted-foreground">
              {label || payload[0].name}
            </span>
            <span className="font-bold text-popover-foreground">
              {formatCurrency(payload[0].value)}
            </span>
          </div>
        </div>
      </div>
    )
  }

  return null
}

const CHART_COLORS = [
  "#2662d9",
  "#e23670",
  "#e88c30",
  "#af57db",
  "#2eb88a",
  "#e8c130",
  "#0ea5e9",
]

export function DashboardCharts({
  weeklyStats,
  categoryStats,
}: DashboardChartsProps) {
  const formattedWeeklyStats = weeklyStats.map((stat, index) => ({
    ...stat,
    day: new Date(stat.date).toLocaleDateString(getLocale(), {
      weekday: "short",
    }),
    fill: CHART_COLORS[index % CHART_COLORS.length],
  }))

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
      <Card className="col-span-4">
        <CardHeader>
          <CardTitle>{m.weekly_spending()}</CardTitle>
          <CardDescription>{m.spending_last_7_days_desc()}</CardDescription>
        </CardHeader>
        <CardContent className="pl-2">
          <ResponsiveContainer width="100%" height={350}>
            <BarChart data={formattedWeeklyStats}>
              <XAxis
                dataKey="day"
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                stroke="#888888"
                fontSize={12}
                tickLine={false}
                axisLine={false}
                tickFormatter={(value: any) => `$${value}`}
              />
              <Tooltip
                content={<CustomTooltip />}
                cursor={{ fill: "hsl(var(--muted))" }}
              />
              <Bar dataKey="amount" radius={[4, 4, 0, 0]}>
                {formattedWeeklyStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
      <Card className="col-span-4 lg:col-span-3">
        <CardHeader>
          <CardTitle>{m.category_breakdown()}</CardTitle>
          <CardDescription>{m.spending_by_category_desc()}</CardDescription>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            <PieChart>
              <Pie
                data={categoryStats}
                dataKey="amount"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={(entry: any) => entry.name}
              >
                {categoryStats.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.fill} />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
            </PieChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}
