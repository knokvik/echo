import { Id } from "../_generated/dataModel.js";
import { mutation, query } from "../_generated/server.js";
import { ConvexError, v } from "convex/values"
import { supportAgent } from "../system/ai/agents/supportAgent.js";
import { saveMessage } from "@convex-dev/agent";
import { components } from "../_generated/api.js";

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
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Conversation Not Found"
            })
        }

        if(conversation.contactSessionId !== session._id) {
            throw new ConvexError({
                code : "NOT_FOUND",
                message : "Incorrect Session"
            })
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
  
      // Check if session does not exist or  session expired
      if (!session || session.expiresAt < Date.now()) {
        throw new ConvexError({
          code: "unauthorized",
          message: "Invalid Session",
        });
      }
  
      const { threadId } = await supportAgent.createThread(ctx , {
        userId : args.organizationId
      })
  
      await saveMessage(ctx , components.agent, {
          threadId,
          message : {
            role : "assistant",
            // Later modify to edit initial message
            content : "How can I help you today?"
          }
      })

      const conversationId = await ctx.db.insert("conversations", {
        contactSessionId: session._id,
        status: "unresolved",
        organizationId: args.organizationId,
        threadId: threadId,
      });
  
      return conversationId;
    },
  });
  