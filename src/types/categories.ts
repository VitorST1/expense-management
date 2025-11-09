import { m } from "@/paraglide/messages"
import { z } from "zod"

export const categorySchema = z.object({
  name: z
    .string()
    .min(1, m.error_name_cannot_be_empty())
    .max(50, m.error_name_too_long()),
})
