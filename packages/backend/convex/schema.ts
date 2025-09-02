import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    name: v.string(),
  }),
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
