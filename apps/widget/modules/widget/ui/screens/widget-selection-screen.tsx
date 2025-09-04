import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ChevronRightIcon, MessageSquareTextIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIDAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget.-header";
import { Button } from "@workspace/ui/components/button";
import { useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { useState } from "react";

export const WidgetSelectionScreen = () => {

    const setConversationId = useSetAtom(conversationIDAtom);
    const setScreen = useSetAtom(screenAtom)
    const organizationId = useAtomValue(organizationIdAtom)
    const setErrorMessage = useSetAtom(errorMessageAtom)
    const contactSessionId = useAtomValue(
      contactSessionIdAtomFamily(organizationId || "")
    )
    const createConversation = useMutation(api.public.conversations.create);
    const [isPending,setIsPending] = useState(false);

    const handleConversation = async () => {

      if( !organizationId ) {
        setScreen("error")
        setErrorMessage("Missing OrganizationID!")
      }
      
      if(!contactSessionId) {
        setScreen("auth")
        return;
      } 

      setIsPending(true);

      try {
        const conversationId = await createConversation({
          contactSessionId: String(contactSessionId),
          organizationId : String(organizationId)
        })
        setConversationId(conversationId)
        setScreen("chat")
      } catch (error) {
        setScreen("auth")
      } finally {
        setIsPending(false)
      }
    }
    return (
        <>
          <WidgetHeader>
            <div className="flex flex-col justify-between gap-y-2 px-2 py-6 font-semibold">
                <p className="text-3xl">
                Hi there! 👋
                </p>
                <p className="text-lg">
                Let&apos; sget you started!
                </p>
            </div>
          </WidgetHeader>
          <div className="flex flex-1 flex-col items-center justify-center gap-y-4 p-4 overflow-y-auto">
              <Button className="h-16 w-full justify-between"
              variant="outline"
              onClick={() => handleConversation()}
              disabled={isPending}>
                <div className="flex items-center gap-x-2">
                  <MessageSquareTextIcon className="size-4"/>
                  <span>Start Chat</span>
                </div>
                <ChevronRightIcon/>
              </Button>
          </div>
        </>
    )
}