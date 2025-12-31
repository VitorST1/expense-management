import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  categories: defineTable({
    name: v.string(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .searchIndex("search_name", {
      searchField: "name",
      filterFields: ["userId"],
    }),
  expenses: defineTable({
    category: v.id("categories"),
    description: v.optional(v.string()),
    amount: v.number(),
    date: v.number(),
    userId: v.string(),
  })
    .index("by_user", ["userId"])
    .index("by_user_and_category", ["userId", "category"])
    .index("by_user_and_date", ["userId", "date"])
    .index("by_user_category_date", ["userId", "category", "date"])
    .searchIndex("search_description", {
      searchField: "description",
      filterFields: ["userId", "category"],
    }),
})
