  "use client"

import { useVapi } from "@/hooks/use-vapi"
import { Button } from "../../../packages/ui/src/components/button"

export default function Page() {

  const { startCall , endCall , isConnected , isConnecting , isSpeaking , transcript } = useVapi();
  return (
    <div className="flex items-center justify-center min-h-svh gap-5">
        <Button onClick={()=>startCall()}>Start call</Button>
        <Button onClick={()=>endCall()}>End call</Button>
        <p>isConnected : {`${isConnected}`}</p>
        <p>isConnecting : {`${isConnecting}`}</p>
        <p>isSpeaking : {`${isSpeaking}`}</p>
        {JSON.stringify(transcript, null , 2)}
    </div>
  )
}
