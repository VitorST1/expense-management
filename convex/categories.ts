import { mutation, query } from "./_generated/server"
import { ConvexError, v } from "convex/values"
import { safeGetUser } from "./auth"
import schema from "./schema"
import { partial } from "convex-helpers/validators"
import { omit } from "convex-helpers"

const fieldsWithoutUserId = omit(schema.tables.categories.validator.fields, [
  "userId",
])

export const get = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      return []
    }

    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

export const create = mutation({
  args: fieldsWithoutUserId,
  handler: async (ctx, fields) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      return
    }

    if (!fields.name) {
      throw new ConvexError("Name cannot be empty")
    }

    return await ctx.db.insert("categories", {
      ...fields,
      userId: user._id,
    })
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
      return
    }

    return await ctx.db.patch(args.id, args.update)
  },
})

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      return
    }

    return await ctx.db.delete(args.id)
  },
})
