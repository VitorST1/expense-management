import { query } from "./_generated/server"
import { safeGetUser } from "./auth"
import { ConvexError } from "convex/values"
import { startOfMonth, subDays, startOfDay } from "date-fns"
import { Id } from "./_generated/dataModel"

const COLORS = [
  "#0088FE",
  "#00C49F",
  "#FFBB28",
  "#FF8042",
  "#8884d8",
  "#82ca9d",
]

export const getStats = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    const now = new Date()
    const startOfCurrentMonth = startOfMonth(now).getTime()
    const startOfLast7Days = startOfDay(subDays(now, 6)).getTime()

    // Fetch all expenses for the current month
    const currentMonthExpenses = await ctx.db

      .query("expenses")

      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", user._id).gte("date", startOfCurrentMonth),
      )

      .collect()

    // Calculate Total Month Spend
    const totalMonthScale = currentMonthExpenses.reduce(
      (acc, curr) => acc + curr.amount,
      0,
    )

    // Calculate Category Breakdown for Month
    const categoryStatsMap = new Map<string, number>()
    for (const expense of currentMonthExpenses) {
      const current = categoryStatsMap.get(expense.category) || 0
      categoryStatsMap.set(expense.category, current + expense.amount)
    }

    // Resolve Category Names
    const categoryStats = await Promise.all(
      Array.from(categoryStatsMap.entries()).map(
        async ([categoryId, amount], index) => {
          const category = await ctx.db.get(categoryId as Id<"categories">)
          const safeName = category ? category.name : "Unknown"
          return {
            name: safeName,
            amount,
            fill: COLORS[index % COLORS.length],
          }
        },
      ),
    )

    // Fetch expenses for last 7 days
    const last7DaysExpenses = await ctx.db

      .query("expenses")

      .withIndex("by_user_and_date", (q) =>
        q.eq("userId", user._id).gte("date", startOfLast7Days),
      )

      .collect()

    // Aggregate by Day (Last 7 Days)
    const dailyStatsMap = new Map<string, number>()
    for (let i = 0; i < 7; i++) {
      const d = subDays(now, i)
      const dayStart = startOfDay(d).getTime()
      dailyStatsMap.set(dayStart.toString(), 0)
    }

    for (const expense of last7DaysExpenses) {
      const dayStart = startOfDay(new Date(expense.date)).getTime().toString()
      if (dailyStatsMap.has(dayStart)) {
        dailyStatsMap.set(
          dayStart,
          dailyStatsMap.get(dayStart)! + expense.amount,
        )
      }
    }

    const weeklyStats = Array.from(dailyStatsMap.entries())

      .map(([dateTs, amount]) => ({
        date: parseInt(dateTs),
        amount,
      }))

      .sort((a, b) => a.date - b.date)

    // Recent Activity (Top 5)
    const recentExpenses = await ctx.db

      .query("expenses")

      .withIndex("by_user_and_date", (q) => q.eq("userId", user._id))

      .order("desc")

      .take(5)

    const recentActivity = await Promise.all(
      recentExpenses.map(async (exp) => {
        const cat = await ctx.db.get(exp.category)
        return {
          ...exp,
          categoryName: cat?.name || "-",
        }
      }),
    )

    return {
      totalMonth: totalMonthScale,
      categoryStats,
      weeklyStats,
      recentActivity,
    }
  },
})
