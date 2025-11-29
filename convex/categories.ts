import { mutation, query } from "./_generated/server"
import { components } from "./_generated/api"
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
      throw new ConvexError("User is not authenticated")
    }

    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect()
  },
})

export const getPaginated = query({
  args: { paginationOpts: v.any() },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    return await ctx.db
      .query("categories")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .paginate(args.paginationOpts)
  },
})

export const count = query({
  args: {},
  handler: async (ctx) => {
    const user = await safeGetUser(ctx)

    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    const aggregate = await ctx.runQuery(
      components.aggregate.btree.aggregateBetween,
      { namespace: user._id },
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

    if (!fields.name) {
      throw new ConvexError("Name cannot be empty")
    }

    const id = await ctx.db.insert("categories", {
      ...fields,
      userId: user._id,
    })

    await ctx.runMutation(components.aggregate.public.insert, {
      key: id,
      namespace: user._id,
      summand: 1,
      value: null,
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

    return await ctx.db.patch(args.id, args.update)
  },
})

export const remove = mutation({
  args: { id: v.id("categories") },
  handler: async (ctx, args) => {
    const user = await safeGetUser(ctx)
    if (!user) {
      throw new ConvexError("User is not authenticated")
    }

    await ctx.db.delete(args.id)

    await ctx.runMutation(components.aggregate.public.delete_, {
      key: args.id,
      namespace: user._id,
    })
  },
})
