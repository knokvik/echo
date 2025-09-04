import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { AlertTriangleIcon, ArrowLeftIcon, MenuIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIDAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget.-header";
import { Button } from "@workspace/ui/components/button";
import { useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { set } from "react-hook-form";

export const WidgetChatScreen = () => {
  const setScreen = useSetAtom(screenAtom);
  const setConversationId = useSetAtom(conversationIDAtom);
  const conversationId = useAtomValue(conversationIDAtom);
  const organizationId = useAtomValue(organizationIdAtom)
  const contactSessionId = useAtomValue(
    contactSessionIdAtomFamily(organizationId || "")
  )

  const conversation = useQuery(
    api.public.conversations.getOne,
    conversationId && contactSessionId ? {
      conversationId,
      contactSessionId,
    } : "skip"
  )

  const onBack = () => {
    setConversationId(null)
    setScreen("selection")
  }
    return (
        <>
          <WidgetHeader className="flex items-center justify-between">
            <div className="flex items-center gap-x-2">
                <Button onClick={() => onBack()} size="icon" variant="transparent">
                  <ArrowLeftIcon/>
                </Button>
                <p>Chat</p>
            </div>
            <Button size="icon">
              <MenuIcon/>
            </Button>
          </WidgetHeader>
          <div className="flex flex-1 flex-col gap-y-4 p-4">
            <p className="text-sm">
               {JSON.stringify(conversation)}
            </p>
          </div>
        </>
    )
}