import { internal } from "../_generated/api.js";
import { action, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values";
import { supportAgent } from "../system/ai/agents/supportAgent.js";
import { paginationOptsValidator } from "convex/server";

export const create = action({
  args: {
    prompt: v.string(),
    threadId: v.string(),
    contactSessionId: v.id("contactSession"),
  },
  handler: async (ctx, args) => {
    const contactSession = await ctx.runQuery(
      internal.system.contactSessions.getOne,
      {
        contactSessionId: args.contactSessionId,
      }
    );

    if(!contactSession || contactSession.expiresAt < Date.now()) {
        throw new ConvexError({
            code : "UNAUTHORIZED",
            message : "Invalid Session"
        })
    }

    const conversation = await ctx.runQuery(
        internal.system.converstions.getByThread,
        {
            threadId : args.threadId
        }
    )

    if(!conversation) {
        throw new ConvexError({
            code : "NOT_FOUND",
            message : "Conversation not found"
        })
    }

    if(conversation.status === "resolved") {
        throw new ConvexError({
            code : "BAD_REQUEST",
            message : "Conversation resolved"
        })
    }

    // Todo : Implement subscription check

    await supportAgent.generateText( 
        ctx , 
        { threadId : args.threadId}, 
        { prompt : args.prompt }
    ) 
  },
});


export const getMany = query({
    args : {
        threadId : v.string(),
        paginationOpts : paginationOptsValidator,
        contactSessionId : v.id("contactSession")
    },
    handler : async (ctx , args) => {
        const contactSession = await ctx.db.get(args.contactSessionId)

        if(!contactSession || contactSession.expiresAt < Date.now()) {
            throw new ConvexError({
                code : "UNAUTHORIZED",
                message : "Invalid session"
            })
        }

        const paginated = await supportAgent.listMessages(ctx , {
            threadId : args.threadId,
            paginationOpts : args.paginationOpts
        })

        return paginated;
    }
})