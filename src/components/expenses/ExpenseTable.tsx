import { m } from "@/paraglide/messages.js"
import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { PaginationState } from "@tanstack/react-table"
import { api } from "convex/_generated/api"
import { Id } from "convex/_generated/dataModel"
import { useEffect, useState } from "react"
import { toast } from "sonner"
import { columns } from "./columns.tsx"
import { DataTable } from "../ui/DataTable.tsx"

export default function ExpenseTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    0: null,
  })

  const { data, error, isLoading } = useSuspenseQuery(
    convexQuery(api.expenses.getPaginated, {
      paginationOpts: {
        numItems: pagination.pageSize,
        cursor: cursors[pagination.pageIndex] ?? null,
      },
    }),
  )

  const count = useSuspenseQuery(convexQuery(api.expenses.count, {})).data

  useEffect(() => {
    if (data?.continueCursor) {
      setCursors((prev) => ({
        ...prev,
        [pagination.pageIndex + 1]: data.continueCursor,
      }))
    }
  }, [data, pagination.pageIndex])

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

  if (error) {
    console.error(error)
    return (
      <div className="grow self-center content-center text-zinc-200">
        {m.something_went_wrong()}
      </div>
    )
  }

  return (
    <DataTable
      columns={columns({ onDelete: handleDelete })}
      data={data.page}
      isLoading={isLoading}
      manualPagination
      pageCount={
        count === data.page.length ? 1 : Math.ceil(count / pagination.pageSize)
      }
      rowCount={count}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
