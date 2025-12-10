import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { useAppForm } from "@/hooks/form"
import { getInternationalizationMessageFromKey } from "@/lib/utils"
import { m } from "@/paraglide/messages"
import { useConvexMutation, convexQuery } from "@convex-dev/react-query"
import { useMutation, useSuspenseQuery } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { ConvexError } from "convex/values"
import { toast } from "sonner"
import { expenseSchema } from "@/types/expenses.ts"
import { Doc, Id } from "convex/_generated/dataModel"
import { ReactNode, useState } from "react"
import { PlusIcon } from "lucide-react"

interface ExpenseDialogProps {
  expense?: Doc<"expenses">
  children?: ReactNode
}

export default function ExpenseDialog({
  expense,
  children,
}: ExpenseDialogProps) {
  const [open, setOpen] = useState(false)
  const isEdit = !!expense

  const { data: categories } = useSuspenseQuery(
    convexQuery(api.categories.get, {}),
  )

  const { mutateAsync: createMutate } = useMutation({
    mutationFn: useConvexMutation(api.expenses.create),
  })

  const { mutateAsync: updateMutate } = useMutation({
    mutationFn: useConvexMutation(api.expenses.update),
  })

  const defaultValues = isEdit
    ? {
        category: expense.category,
        description: expense.description,
        amount: expense.amount,
        date: expense.date,
      }
    : {
        category: "" as Id<"categories">,
        description: undefined as string | undefined,
        amount: 0,
        date: Date.now(),
      }

  const form = useAppForm({
    defaultValues,
    validators: {
      onSubmit: expenseSchema,
    },
    onSubmit: async ({ value }) => {
      try {
        if (isEdit) {
          await updateMutate({ id: expense._id, update: value })
        } else {
          await createMutate(value)
        }
        setOpen(false)
        form.reset()
      } catch (error) {
        const errorMessage =
          error instanceof ConvexError
            ? getInternationalizationMessageFromKey({
                prefix: "error_",
                value: error.data,
                regex: / /g,
                replacer: "_",
                transform: (s) => s.toLowerCase(),
                fallback: m.error_occurred(),
              })
            : m.error_occurred()

        toast.error(errorMessage)
      }
    },
  })

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {children ? (
          children
        ) : (
          <Button className="w-fit self-end-safe">
            <PlusIcon className="size-4" />
            {m.add_expense()}
          </Button>
        )}
      </DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>
            {isEdit ? m.edit_expense() : m.add_expense()}
          </DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-4">
            <form.AppField name="category">
              {(field) => (
                <field.Select
                  label={m.category()}
                  placeholder={m.select_category()}
                  values={categories.map((c) => ({
                    label: c.name,
                    value: c._id,
                  }))}
                />
              )}
            </form.AppField>
            <form.AppField name="description">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <field.TextField
                    label={m.description()}
                    placeholder={m.description()}
                    autocomplete="off"
                    isInvalid={isInvalid}
                  />
                )
              }}
            </form.AppField>
            <form.AppField name="amount">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <field.NumberField label={m.amount()} isInvalid={isInvalid} />
                )
              }}
            </form.AppField>
            <form.AppField name="date">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid
                return (
                  <field.DateField label={m.date()} isInvalid={isInvalid} />
                )
              }}
            </form.AppField>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
            >
              {m.cancel()}
            </Button>
            <form.AppForm>
              <form.SubscribeButton label={m.save()} />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
