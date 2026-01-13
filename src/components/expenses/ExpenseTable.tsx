import { m } from "@/paraglide/messages.js"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { Id } from "convex/_generated/dataModel"
import { toast } from "sonner"
import { columns } from "./columns.tsx"
import { DataTable } from "../ui/DataTable.tsx"
import { usePaginatedQuery } from "convex/react"
import { ExpenseFilters } from "./ExpenseFilters"
import { startOfMonth, endOfMonth } from "date-fns"
import { useState } from "react"

export default function ExpenseTable() {
  const [searchQuery, setSearchQuery] = useState("")
  const [category, setCategory] = useState<Id<"categories"> | undefined>(undefined)
  const [month, setMonth] = useState<Date | undefined>(undefined)

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.expenses.getPaginated,
    {
      search: searchQuery || undefined,
      category: category,
      minDate: month ? startOfMonth(month).getTime() : undefined,
      maxDate: month ? endOfMonth(month).getTime() : undefined,
    },
    { initialNumItems: 20 },
  )

  const { mutateAsync: deleteExpense } = useMutation({
    mutationFn: useConvexMutation(api.expenses.remove),
  })

  const handleDelete = async (id: Id<"expenses">) => {
    try {
      await deleteExpense({ id })
    } catch (error) {
      console.error(error)
      toast.error(m.error_occurred())
    }
  }

  return (
    <div className="space-y-4">
      <ExpenseFilters
        onSearchChange={setSearchQuery}
        category={category}
        setCategory={setCategory}
        month={month}
        setMonth={setMonth}
      />
      <DataTable
        columns={columns({ onDelete: handleDelete })}
        data={results}
        isLoading={isLoading}
        onLoadMore={() => loadMore(10)}
        hasMore={status !== "Exhausted"}
        isLoadingMore={status === "LoadingMore"}
      />
    </div>
  )
}
