"use client"

import { useThreadMessages , toUIMessages } from "@convex-dev/agent/react"
import { useAtom, useAtomValue, useSetAtom } from "jotai";
import { ArrowLeftIcon, MenuIcon } from "lucide-react";
import { contactSessionIdAtomFamily, conversationIDAtom, errorMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { WidgetHeader } from "../components/widget.-header";
import { Button } from "@workspace/ui/components/button";
import { useAction, useQuery } from "convex/react";
import { api } from "@workspace/backend/_generated/api";
import { DicebearAvatar } from "@workspace/ui/components/avatar-echo"
import { 
       AIConversation , AIConversationContent , AIConversationScrollButton
} from "@workspace/ui/components/ui/conversation"
import {
  AIInput,
  AIInputButton,
  AIInputSubmit,
  AIInputTextarea,
  AIInputToolbar,
  AIInputTools
} from "@workspace/ui/components/ui/input"
import { useInfiniteScroll } from "@workspace/ui/hooks/use-infinite-scroll"
import { InfiniteScrollTrigger } from "../components/infinite-scroll-trigger";
import {
  AIMessage,
  AIMessageContent,
} from "@workspace/ui/components/ui/message"
import { AIResponse } from "@workspace/ui/components/ui/response"
import { useState } from "react";

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
  const messages = useThreadMessages(
    api.public.messages.getMany,
    conversation?.threadId && contactSessionId
    ? {
      threadId : conversation.threadId,
      contactSessionId
    } : "skip" ,
    { initialNumItems : 10 }
  )

  const{ topElementRef , isLoadingMore , handleLoadMore , canLoadMore } = useInfiniteScroll({
    status : messages.status,
    loadMore : messages.loadMore,
    loadSize : 10,
  })

  const onBack = () => {
    setConversationId(null)
    setScreen("selection")
  }

  const [input, setInput] = useState("");
  const sendMessage = useAction(api.public.messages.create);

  const handleSendMessage = async () => {
    if (!input) return;

    if(!conversationId || !contactSessionId) {
      console.error("Conversation ID or Contact Session ID is missing.");
      return;
    }

    await sendMessage({
      threadId: conversation?.threadId!,
      contactSessionId: contactSessionId,
      prompt: input,
    });


    setInput(""); // Clear the input after sending
  };

  return (
    <div className="flex flex-col h-full">
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
          <AIConversation className="flex-1 overflow-y-auto">
            <AIConversationContent>
              <InfiniteScrollTrigger
              canLoadMore={canLoadMore}
              isLoadingMore={isLoadingMore}
              onLoadMore={handleLoadMore}
              ref={topElementRef}/>
              {toUIMessages(messages.results ?? [])?.map((message) => {
                return (
                  <AIMessage 
                  key={message.id}
                  from={message.role === "user" ? "user" : "assistant"}
                  >
                    <AIMessageContent>
                      <AIResponse>{message.content}</AIResponse>
                    </AIMessageContent>
                    { message.role === "assistant" && (
                      <DicebearAvatar
                         imageUrl="/logo.svg"
                         seed="assistant"
                         size={32} />
                    )}
                    {/* Add avatar component */}
                  </AIMessage>
                )
              })}
            </AIConversationContent>
          </AIConversation>

          <AIInput className="px-3 py-4">
            {/* <AIInputToolbar> */}
              {/* Add tools here if needed */}
            {/* </AIInputToolbar> */}
            <div className="flex items-center space-x-2">
              <AIInputTextarea
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Type your message..."
                    onKeyDown={(e) => {
                      if (e.key !== 'Shift' && e.key !== 'Meta' && e.key !== 'Control' && e.key !== 'Alt') {
                        e.preventDefault(); 
                        handleSendMessage();
                      }
                    }}
                  />
              <AIInputSubmit status="ready" type="submit" onClick={handleSendMessage}>
                
              </AIInputSubmit>
            </div>
          </AIInput>
        </div>
    )
}

