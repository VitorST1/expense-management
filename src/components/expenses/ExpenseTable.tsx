import { m } from "@/paraglide/messages.js"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { Id } from "convex/_generated/dataModel"
import { toast } from "sonner"
import { columns } from "./columns.tsx"
import { DataTable } from "../ui/DataTable.tsx"
import { usePaginatedQuery } from "convex/react"

export default function ExpenseTable() {
  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.expenses.getPaginated,
    { paginationOpts: { numItems: 20, cursor: null } },
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
    <DataTable
      columns={columns({ onDelete: handleDelete })}
      data={results}
      isLoading={isLoading}
      onLoadMore={() => loadMore(10)}
      hasMore={status !== "Exhausted"}
      isLoadingMore={status === "LoadingMore"}
    />
  )
}
