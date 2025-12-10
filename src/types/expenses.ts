import { z } from "zod"
import { Id } from "convex/_generated/dataModel"
import { m } from "@/paraglide/messages.js"

export const expenseSchema = z.object({
  category: z.custom<Id<"categories">>((val) => typeof val === "string"),
  description: z.union([z.string(), z.undefined()]),
  amount: z.number().gt(0, m.error_amount_must_be_positive()),
  date: z.number(),
})
