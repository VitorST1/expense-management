import { m } from "@/paraglide/messages.js"
import { Item, ItemActions, ItemContent, ItemDescription, ItemTitle } from "../ui/item.tsx"
import ExpenseDialog from "./ExpenseDialog.tsx"

export default function ExpenseItem() {
  return (
    <Item variant="outline">
      <ItemContent>
        <ItemTitle className="text-3xl">{m.expenses()}</ItemTitle>
        <ItemDescription>{m.expenses_description()}</ItemDescription>
      </ItemContent>
      <ItemActions>
        <ExpenseDialog />
      </ItemActions>
    </Item>
  )
}
