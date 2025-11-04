import AddCategoryItem from "@/components/categories/AddCategoryItem"
import CategoryTable from "@/components/categories/CategoryTable"
import { convexQuery } from "@convex-dev/react-query"
import { createFileRoute } from "@tanstack/react-router"
import { api } from "convex/_generated/api"

export const Route = createFileRoute("/_authenticated/categories")({
  component: RouteComponent,
  loader: async (opts) => {
    await opts.context.queryClient.ensureQueryData(
      convexQuery(api.categories.get, {}),
    )
  }
})

function RouteComponent() {
  return  <div className="flex flex-col grow gap-4 p-4">
    <AddCategoryItem />
    <CategoryTable />
  </div>
}
