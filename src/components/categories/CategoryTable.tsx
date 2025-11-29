import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { DataTable } from "../ui/DataTable"
import { columns } from "./columns"
import { m } from "@/paraglide/messages"
import { Id } from "convex/_generated/dataModel"
import { toast } from "sonner"
import { useEffect, useState } from "react"
import { PaginationState } from "@tanstack/react-table"

export default function CategoryTable() {
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: 10,
  })
  const [cursors, setCursors] = useState<Record<number, string | null>>({
    0: null,
  })

  const { data, error, isLoading } = useSuspenseQuery(
    convexQuery(api.categories.getPaginated, {
      paginationOpts: {
        numItems: pagination.pageSize,
        cursor: cursors[pagination.pageIndex] ?? null,
      },
    }),
  )

  const count = useSuspenseQuery(convexQuery(api.categories.count, {})).data

  useEffect(() => {
    if (data?.continueCursor) {
      setCursors((prev) => ({
        ...prev,
        [pagination.pageIndex + 1]: data.continueCursor,
      }))
    }
  }, [data, pagination.pageIndex])

  const { mutateAsync: deleteCategory } = useMutation({
    mutationFn: useConvexMutation(api.categories.remove),
  })

  const handleDelete = async (id: Id<"categories">) => {
    try {
      await deleteCategory({ id })
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
      pageCount={Math.ceil(count / pagination.pageSize)}
      rowCount={count}
      pagination={pagination}
      onPaginationChange={setPagination}
    />
  )
}
