import { v } from "convex/values"
import { internalQuery } from "../_generated/server.js"

export const getByThread = internalQuery({
    args : {
        threadId : v.string()
    },
    handler : async (ctx , args) => {
        const conversation = await ctx.db
        .query("conversations")
        .withIndex("by_thread_id" , (q) => q.eq("threadId" , args.threadId))
        .unique()
        
        return conversation;
    },
})