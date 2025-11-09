import { ColumnDef } from "@tanstack/react-table"
import { Doc, Id } from "convex/_generated/dataModel"
import { m } from "@/paraglide/messages"
import { Button } from "../ui/button"
import { PencilIcon, Trash2Icon } from "lucide-react"
import { Tooltip, TooltipContent, TooltipTrigger } from "../ui/tooltip"
import { AlertDialog, AlertDialogTrigger } from "../ui/alert-dialog"
import DeleteDialogContent from "../ui/DeleteDialogContent"

export const columns = ({
    onDelete,
}: {
    onDelete: (id: Id<"categories">) => void
}): ColumnDef<Doc<"categories">>[] => [
    {
        accessorKey: "name",
        header: m.name(),
    },
    {
        accessorKey: "actions",
        header: "",
        meta: { className: "w-0" },
        cell: ({ row }) => {
            const category = row.original
            return <div className="flex gap-2">
                <Tooltip>
                    <TooltipTrigger asChild>
                        <Button className="bg-blue-500 text-zinc-100 hover:bg-blue-700" size="icon-sm">
                            <PencilIcon />
                        </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-blue-700 text-zinc-100" arrowClassName="bg-blue-700 fill-blue-700" side="bottom">
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
                        <TooltipContent className="bg-red-700 text-zinc-100" arrowClassName="bg-red-700 fill-red-700" side="bottom">
                            {m.delete()}
                        </TooltipContent>
                    </Tooltip>

                    <DeleteDialogContent
                        title={m.delete_confirm_title({ item: m.category() })}
                        description={m.delete_confirm_description({ name: category.name })}
                        onDelete={() => onDelete(category._id)}
                    />
                </AlertDialog>
            </div>
        },
    }
]