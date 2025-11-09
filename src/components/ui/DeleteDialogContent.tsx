import { m } from "@/paraglide/messages"
import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog"

export default function DeleteDialogContent({
  title,
  description,
  onDelete,
}: {
  title?: string
  description?: string
  onDelete: () => void
}) {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>{title}</AlertDialogTitle>
        <AlertDialogDescription>{description}</AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel>{m.cancel()}</AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          className="bg-red-500 hover:bg-red-700 text-zinc-100">
          {m.delete()}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  )
}
