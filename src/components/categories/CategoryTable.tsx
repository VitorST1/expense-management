import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { DataTable } from "../ui/DataTable"
import { columns } from "./columns"
import { m } from "@/paraglide/messages"
import { Id } from "convex/_generated/dataModel"
import { toast } from "sonner"
import { usePaginatedQuery } from "convex/react"
import { Input } from "../ui/input"
import { useState } from "react"
import { useDebounce } from "@/hooks/use-debounce.ts"

export default function CategoryTable() {
  const [search, setSearch] = useState("")
  const debouncedSearch = useDebounce(search, 500)

  const { results, status, loadMore, isLoading } = usePaginatedQuery(
    api.categories.getPaginated,
    { search: debouncedSearch === "" ? undefined : debouncedSearch },
    { initialNumItems: 20 },
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

  return (
    <div className="space-y-4">
      <Input
        placeholder={m.search()}
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className=""
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
