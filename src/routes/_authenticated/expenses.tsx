import AddExpenseItem from "@/components/expenses/AddExpenseItem.tsx"
import ExpenseTable from "@/components/expenses/ExpenseTable.tsx"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_authenticated/expenses")({
  component: RouteComponent,
})

function RouteComponent() {
  return (
    <div className="flex flex-col grow gap-4 p-4">
      <AddExpenseItem />
      <ExpenseTable />
    </div>
  )
}
