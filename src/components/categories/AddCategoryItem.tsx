import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemTitle,
} from "@/components/ui/item"
import { useAppForm } from "@/hooks/form"
import { getInternationalizationMessageFromKey } from "@/lib/utils"
import { m } from "@/paraglide/messages"
import { categorySchema } from "@/types/categories"
import { useConvexMutation } from "@convex-dev/react-query"
import { useMutation } from "@tanstack/react-query"
import { api } from "convex/_generated/api"
import { ConvexError } from "convex/values"
import { toast } from "sonner"


export default function AddCategoryItem() {
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
                await mutateAsync(value)
                form.reset()
            } catch (error) {
                console.log(error)

                const errorMessage = error instanceof ConvexError ? getInternationalizationMessageFromKey({
                    prefix: "error_",
                    value: error.data,
                    regex: / /g,
                    replacer: "_",
                    transform: (s) => s.toLowerCase(),
                    fallback: m.error_occurred(),
                }) : m.error_occurred()

                toast.error(errorMessage)
            }
        },
    })

    return <form
        onSubmit={(e) => {
            e.preventDefault()
            e.stopPropagation()
            form.handleSubmit()
        }}
    >
        <Item variant="outline">
            <ItemContent>
            <ItemTitle>
                <form.AppField name="name">
                    {(field) => {
                        const isInvalid = field.state.meta.isTouched && !field.state.meta.isValid

                        return <field.TextField
                            label={m.add_new_category()}
                            placeholder={m.category_name()}
                            autocomplete="off"
                            isInvalid={isInvalid}
                        />
                    }}
                </form.AppField>
            </ItemTitle>
            <ItemDescription>
                
            </ItemDescription>
            </ItemContent>
            <ItemActions>
                <form.AppForm>
                    <form.SubscribeButton label={m.add_category()} />
                </form.AppForm>
            </ItemActions>
        </Item>
    </form>
}