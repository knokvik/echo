import { Id } from "../_generated/dataModel.js";
import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values"

export const getOne = query({
    args : {
        conversationId : v.id("conversations"),
        contactSessionId : v.id("contactSession")
    },
    handler : async (ctx , args) => {

        const session = await ctx.db.get(args.contactSessionId as Id<"contactSession">);

        if (!session || session.expiresAt < Date.now()) {
            throw new ConvexError({
              code: "unauthorized",
              message: "Invalid Session",
            });
        }

        const conversation = await ctx.db.get(args.conversationId);

        if(!conversation) {
            return null;
        }

        return {
            _id : conversation._id,
            status : conversation.status,
            threadId : conversation.threadId
        }

    }
})

export const create = mutation({
    args: {
      organizationId: v.string(),
      contactSessionId: v.string(),
    },
    handler: async (ctx, args) => {
      const session = await ctx.db.get(args.contactSessionId as Id<"contactSession">);
  
      // Check if session does not exist or session expired
      if (!session || session.expiresAt < Date.now()) {
        throw new ConvexError({
          code: "unauthorized",
          message: "Invalid Session",
        });
      }
  
      const threadId = "123"; // placeholder, consider generating dynamically if needed
  
      const conversationId = await ctx.db.insert("conversations", {
        contactSessionId: session._id,
        status: "unresolved",
        organizationId: args.organizationId,
        threadId: threadId,
      });
  
      return conversationId;
    },
  });
  