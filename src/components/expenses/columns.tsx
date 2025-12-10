import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "convex/_generated/dataModel"
import { m } from "@/paraglide/messages"
import { Button } from "../ui/button"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog"
import DeleteDialogContent from "../ui/DeleteDialogContent"
import ExpenseDialog from "./ExpenseDialog"
import { getLocale } from "@/paraglide/runtime"

export const columns = ({
  onDelete,
}: {
  onDelete: (id: Id<"expenses">) => void
}): ColumnDef<Doc<"expenses"> & { categoryName: string }>[] => [
  {
    accessorKey: "date",
    header: m.date(),
    cell: ({ row }) => {
      return new Date(row.getValue("date")).toLocaleDateString(getLocale())
    },
  },
  {
    accessorKey: "category",
    header: m.category(),
    cell: ({ row }) => row.original.categoryName || "-",
  },
  {
    accessorKey: "description",
    header: m.description(),
    cell: ({ row }) => row.original.description || "-",
  },
  {
    accessorKey: "amount",
    header: m.amount(),
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"))
      const formatted = new Intl.NumberFormat(getLocale(), {
        style: "currency",
        currency: getLocale() === "pt-br" ? "BRL" : "USD",
      }).format(amount)
      return formatted
    },
  },
  {
    accessorKey: "actions",
    header: "",
    meta: { className: "w-0" },
    cell: ({ row }) => {
      const expense = row.original
      return (
        <div className="flex gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <ExpenseDialog expense={expense}>
                <Button
                  className="bg-blue-500 text-zinc-100 hover:bg-blue-700"
                  size="icon-sm"
                >
                  <PencilIcon />
                </Button>
              </ExpenseDialog>
            </TooltipTrigger>
            <TooltipContent
              className="bg-blue-700 text-zinc-100"
              arrowClassName="bg-blue-700 fill-blue-700"
              side="bottom"
            >
              {m.edit()}
            </TooltipContent>
          </Tooltip>

          <AlertDialog>
            <Tooltip>
              <TooltipTrigger asChild>
                <AlertDialogTrigger asChild>
                  <Button
                    className="bg-red-500 text-zinc-100 hover:bg-red-700"
                    size="icon-sm"
                  >
                    <Trash2Icon />
                  </Button>
                </AlertDialogTrigger>
              </TooltipTrigger>
              <TooltipContent
                className="bg-red-700 text-zinc-100"
                arrowClassName="bg-red-700 fill-red-700"
                side="bottom"
              >
                {m.delete()}
              </TooltipContent>
            </Tooltip>

            <DeleteDialogContent
              title={m.delete_confirm_title({ item: m.expense() })}
              description={m.delete_confirm_description({
                name: expense.description || m.expense(),
              })}
              onDelete={() => onDelete(expense._id)}
            />
          </AlertDialog>
        </div>
      )
    },
  },
]
