import { google } from "@ai-sdk/google"
import { Agent } from "@convex-dev/agent"
import { components } from "../../../_generated/api.js"

export const supportAgent = new Agent(components.agent, {
    chat : google.chat("gemini-2.0-flash"),
    instructions : "You are a customer support agent!"
})