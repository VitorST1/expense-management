import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
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
import { Id } from "convex/_generated/dataModel"

interface AddCategoryDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: (id: Id<"categories">) => void
}

export default function AddCategoryDialog({
  open,
  onOpenChange,
  onSuccess,
}: AddCategoryDialogProps) {
  const { mutateAsync } = useMutation({
    mutationFn: useConvexMutation(api.categories.create),
  })

  const form = useAppForm({
    defaultValues: {
      name: "",
    },
    validators: {
      onSubmit: categorySchema,
    },
    onSubmit: async ({ value }) => {
      try {
        const id = await mutateAsync(value)
        onSuccess?.(id)
        onOpenChange(false)
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader className="sr-only">
          <DialogTitle>{m.add_new_category()}</DialogTitle>
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
                    label={m.add_new_category()}
                    placeholder={m.category_name()}
                    autocomplete="off"
                    isInvalid={isInvalid}
                  />
                )
              }}
            </form.AppField>
          </div>
          <DialogFooter className="mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
            >
              {m.cancel()}
            </Button>
            <form.AppForm>
              <form.SubscribeButton label={m.add_category()} />
            </form.AppForm>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
