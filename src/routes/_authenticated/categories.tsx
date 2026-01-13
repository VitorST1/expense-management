import AddCategoryItem from "@/components/categories/AddCategoryItem"
import CategoryTable from "@/components/categories/CategoryTable"
import { convexQuery } from "@convex-dev/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "convex/_generated/api"

export const Route = createFileRoute("/_authenticated/categories")({
  component: RouteComponent,
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.categories.getPaginated, {
        paginationOpts: { numItems: 10, cursor: null },
      }),
    )
  },
})

function RouteComponent() {
  return (
    <div className="flex grow flex-col gap-4 p-8 pt-6">
      <AddCategoryItem />
      <CategoryTable />
    </div>
  )
}
