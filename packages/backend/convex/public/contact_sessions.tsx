import { v } from "convex/values"
import { mutation } from "../_generated/server.js"

const SESSION_DURATION_MS = 24 * 60 * 60 * 1000;

export const create = mutation({
    args : {
    name: v.string(),
    email: v.string(),
    organizationId: v.string(),
    expiresAt: v.number(),
    metadata: v.optional(
      v.object({
        userAgent: v.string(),
        language: v.string(),
        languages: v.optional(v.string()),
        platform: v.string(),
        vendor: v.string(),
        screenResolution: v.string(),
        viewportSize: v.string(),
        timezone: v.string(),
        timezoneOffset: v.number(),
        cookieEnabled: v.boolean(),
        referrer: v.string(),
        currentUrl: v.string(),
      })
    ),
    },
    handler : async ( ctx , args ) => {
        const now = Date.now();
        const expiresAt = now + SESSION_DURATION_MS;
        const contactSessionId = await ctx.db.insert("contactSession" , {
            name : args.name,
            email : args.email,
            organizationId : args.organizationId,
            expiresAt : expiresAt,
            metadata : args.metadata,
        })

        return contactSessionId;
    }
})