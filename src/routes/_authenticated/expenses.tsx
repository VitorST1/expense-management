import ExpenseItem from "@/components/expenses/ExpenseItem.tsx"
import ExpenseTable from "@/components/expenses/ExpenseTable.tsx"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/expenses")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex grow flex-col gap-4 p-8 pt-6">
      <ExpenseItem />
      <ExpenseTable />
    </div>
  )
}
