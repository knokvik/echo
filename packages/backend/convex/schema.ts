import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),
  conversations : defineTable({
    threadId : v.string(),
    organizationId : v.string(),
    contactSessionId : v.string(),
    status : v.union(
      v.literal("unresolved"),
      v.literal("escalated"),
      v.literal("resolved")
    )
  })
  .index("by_organizaton_id" , ["organizationId"])
  .index("by_contact_session_id" , ["contactSessionId"])
  .index("by_thread_id" , ["threadId"])
  .index("by_status_and_organizaton_id" , ["status" , "organizationId"]),

  contactSession: defineTable({
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
  })
    .index("by_expires_at", ["expiresAt"])
    .index("by_organization_id", ["organizationId"]),
});
