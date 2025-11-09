import { convexQuery, useConvexMutation } from "@convex-dev/react-query"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { DataTable } from "../ui/DataTable"
import { columns } from "./columns"
import { m } from "@/paraglide/messages"
import { Id } from "convex/_generated/dataModel"
import { toast } from "sonner"

export default function CategoryTable() {
  const { data, error, isLoading } = useSuspenseQuery(
    convexQuery(api.categories.get, {}),
  )
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
      data={data}
      isLoading={isLoading}
    />
  )
}
