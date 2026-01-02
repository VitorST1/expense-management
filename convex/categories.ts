import { mutation, query } from "./_generated/server"
import { internal } from "./_generated/api"
import { ConvexError, v } from "convex/values"
import { safeGetUser } from "./auth"
import schema from "./schema"
import { partial } from "convex-helpers/validators"
import { omit } from "convex-helpers"
import { paginationOptsValidator } from "convex/server"

const fieldsWithoutUserId = omit(schema.tables.categories.validator.fields, [
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
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

export const getPaginated = query({
  args: {
    paginationOpts: paginationOptsValidator,
    search: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    if (args.search) {
      return await ctx.db
        .query("categories")
        .withSearchIndex("search_name", (q) =>
          q.search("name", args.search!).eq("userId", user._id),
        )
        .paginate(args.paginationOpts)
    }

    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .paginate(args.paginationOpts)
  },
})

export const create = mutation({
  args: fieldsWithoutUserId,
  handler: async (ctx, fields) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    if (!fields.name) {
      throw new ConvexError("Name cannot be empty")
    }

    const id = await ctx.db.insert("categories", {
      ...fields,
      userId: user._id,
    })

    return id
  },
})

export const update = mutation({
  args: {
    id: v.id("categories"),
    update: v.object(partial(fieldsWithoutUserId)),
  },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    return await ctx.db.patch("categories", args.id, args.update)
  },
})

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    await ctx.db.delete("categories", args.id)

    await ctx.scheduler.runAfter(0, internal.expenses.deleteExpensesRecursive, {
      categoryId: args.id,
      userId: user._id,
    })
  },
})
