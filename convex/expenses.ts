import { internalMutation, mutation, query } from "./_generated/server"
import { internal } from "./_generated/api"
import { ConvexError, v } from "convex/values"
import { safeGetUser } from "./auth"
import schema from "./schema"
import { omit } from "convex-helpers"
import { partial } from "convex-helpers/validators"
import { paginationOptsValidator } from "convex/server"

const fieldsWithoutUserId = omit(schema.tables.expenses.validator.fields, ["userId"])

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    return await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

export const getPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
    category: v.optional(v.id("categories")),
    minDate: v.optional(v.number()),
    maxDate: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    if (args.search) {
      const searchResult = await ctx.db
        .query("expenses")
        .withSearchIndex("search_description", (q) => {
          let qBuilder = q.search("description", args.search!).eq("userId", user._id)
          if (args.category) {
            qBuilder = qBuilder.eq("category", args.category)
          }
          return qBuilder
        })
        .paginate(args.paginationOpts)

      const pageWithCategory = await Promise.all(
        searchResult.page.map(async (expense) => {
          const category = await ctx.db.get("categories", expense.category)
          return {
            ...expense,
            categoryName: category?.name ?? "-",
          }
        }),
      )
      return { ...searchResult, page: pageWithCategory }
    }

    let query

    if (args.category) {
      query = ctx.db.query("expenses").withIndex("by_user_category_date", (q) => {
        const qBuilder = q.eq("userId", user._id).eq("category", args.category!)
        if (args.minDate && args.maxDate) {
          return qBuilder.gte("date", args.minDate).lte("date", args.maxDate)
        } else if (args.minDate) {
          return qBuilder.gte("date", args.minDate)
        } else if (args.maxDate) {
          return qBuilder.lte("date", args.maxDate)
        }
        return qBuilder
      })
    } else {
      query = ctx.db.query("expenses").withIndex("by_user_and_date", (q) => {
        const qBuilder = q.eq("userId", user._id)
        if (args.minDate && args.maxDate) {
          return qBuilder.gte("date", args.minDate).lte("date", args.maxDate)
        } else if (args.minDate) {
          return qBuilder.gte("date", args.minDate)
        } else if (args.maxDate) {
          return qBuilder.lte("date", args.maxDate)
        }
        return qBuilder
      })
    }

    const result = await query.order("desc").paginate(args.paginationOpts)

    const pageWithCategory = await Promise.all(
      result.page.map(async (expense) => {
        const category = await ctx.db.get("categories", expense.category)
        return {
          ...expense,
          categoryName: category?.name ?? "-",
        }
      }),
    )

    return {
      ...result,
      page: pageWithCategory,
    }
  },
})

export const create = mutation({
  args: fieldsWithoutUserId,
  handler: async (ctx, fields) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    const id = await ctx.db.insert("expenses", {
      ...fields,
      userId: user._id,
    })

    return id
  },
})

export const update = mutation({
  args: {
    id: v.id("expenses"),
    update: v.object(partial(fieldsWithoutUserId)),
  },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    return await ctx.db.patch("expenses", args.id, args.update)
  },
})

export const remove = mutation({
  args: { id: v.id("expenses") },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    await ctx.db.delete("expenses", args.id)
  },
})

export const deleteExpensesRecursive = internalMutation({
  args: {
    categoryId: v.id("categories"),
    userId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 100

    const expenses = await ctx.db
      .query("expenses")
      .withIndex("by_user_and_category", (q) =>
        q.eq("userId", args.userId).eq("category", args.categoryId),
      )
      .take(limit)

    if (expenses.length > 0) {
      for (const expense of expenses) {
        await ctx.db.delete("expenses", expense._id)
      }

      if (expenses.length === limit) {
        await ctx.scheduler.runAfter(0, internal.expenses.deleteExpensesRecursive, {
          categoryId: args.categoryId,
          userId: args.userId,
          limit,
        })
      }
    }
  },
})
