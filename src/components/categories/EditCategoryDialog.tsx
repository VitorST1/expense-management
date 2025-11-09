import {
  Dialog,
  DialogClose,
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
import { categorySchema } from "@/types/categories"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { ConvexError } from "convex/values"
import { toast } from "sonner"
import { Doc } from "convex/_generated/dataModel"
import { ReactNode } from "react"

interface EditCategoryDialogProps {
  category: Doc<"categories">
  children: ReactNode
}

export default function EditCategoryDialog({
  category,
  children,
}: EditCategoryDialogProps) {
  const { mutateAsync } = useMutation({
    mutationFn: useConvexMutation(api.categories.update),
  })

  const form = useAppForm({
    defaultValues: {
      name: category.name,
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        await mutateAsync({ id: category._id, update: value })
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
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>{m.edit_title({ item: m.category() })}</DialogTitle>
        </DialogHeader>
        <form
          onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
          }}
        >
          <div className="space-y-4">
            <form.AppField name="name">
              {(field) => {
                const isInvalid =
                  field.state.meta.isTouched && !field.state.meta.isValid

                return (
                  <field.TextField
                    label={m.edit_title({ item: m.category() })}
                    placeholder={m.category_name()}
                    autocomplete="off"
                    isInvalid={isInvalid}
                  />
                )
              }}
            </form.AppField>
          </div>
          <DialogFooter className="mt-6">
            <Button type="button" variant="outline" asChild>
              <DialogClose>{m.cancel()}</DialogClose>
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
