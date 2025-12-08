import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  todos: defineTable({
    text: v.string(),
    completed: v.boolean(),
  }),
  categories: defineTable({
    name: v.string(),
    userId: v.string(),
  }).index("by_user", ["userId"]),
  expenses: defineTable({
    category: v.id("categories"),
    description: v.optional(v.string()),
    amount: v.number(),
    date: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .index("by_user_and_date", ["userId", "date"]),
})
