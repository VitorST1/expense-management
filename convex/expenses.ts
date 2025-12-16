import { mutation, query } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { safeGetUser } from "./auth"
import schema from "./schema"
import { omit } from "convex-helpers"
import { partial } from "convex-helpers/validators"
import { paginationOptsValidator } from "convex/server"
import { components } from "./_generated/api.js"

const fieldsWithoutUserId = omit(schema.tables.expenses.validator.fields, [
  "userId",
])

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
  args: { paginationOpts: paginationOptsValidator },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    const result = await ctx.db
      .query("expenses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts)

    // Join categories for the current page
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

export const count = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      return 0
    }

    const aggregate = await ctx.runQuery(
      components.aggregate.btree.aggregateBetween,
      { namespace: [user._id, "expenses"] },
    )

    return aggregate.count
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

    await ctx.runMutation(components.aggregate.public.insert, {
      key: id,
      namespace: [user._id, "expenses"],
      summand: 1,
      value: null,
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

    await ctx.runMutation(components.aggregate.public.delete_, {
      key: args.id,
      namespace: [user._id, "expenses"],
    })
  },
})
