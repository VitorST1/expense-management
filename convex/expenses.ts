import { mutation, query } from "./_generated/server"
import { v } from 'convex/values'
import { safeGetUser } from "./auth"
import schema from "./schema"
import { omit } from "convex-helpers"
import { partial } from "convex-helpers/validators"

const fieldsWithoutUserId = omit(schema.tables.expenses.validator.fields, ["userId"])

export const get = query({
    args: {},
    handler: async (ctx) => {
        const user = await safeGetUser(ctx)

        if (!user) {
            return []
        }

        return await ctx.db
            .query("expenses")
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

        return await ctx.db.insert("expenses", {
            ...fields,
            userId: user._id,
        })
    },
})

export const update = mutation({
    args: { id: v.id("expenses"), update: v.object(partial(fieldsWithoutUserId)) },
    handler: async (ctx, args) => {
        const user = await safeGetUser(ctx)
        if (!user) {
            return
        }
        
        return await ctx.db.patch(args.id, args.update)
    },
})

export const remove = mutation({
    args: { id: v.id("expenses") },
    handler: async (ctx, args) => {
        const user = await safeGetUser(ctx)
        if (!user) {
            return
        }
        
        return await ctx.db.delete(args.id)
    },
})