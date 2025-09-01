import Vapi from '@vapi-ai/web';
import { useState , useEffect, use } from 'react';

interface TranscriptMessage {
    role : "user" | "assistant",
    text : "string",
}

export const useVapi = () => {
    const [vapi,setVapi] = useState<Vapi | null>(null);
    const [isConnected,setIsConnected] = useState(false);
    const [isConnecting,setIsConnecting] = useState(false);
    const [isSpeaking,setIsSpeaking] = useState(false);
    const [transcript,setTranscript] = useState<TranscriptMessage[]>([]);

    useEffect(() => {
        //Only for testing 
        const vapiInstance = new Vapi("d548c8dc-22d4-4399-a80d-7d78e573af4c");
        setVapi(vapiInstance);

        vapiInstance.on("call-start", () => {
            setIsConnecting(false);
            setIsConnected(false);
            setIsSpeaking(false);
        })

        vapiInstance.on("speech-start", () => {
            setIsSpeaking(true);
        })

        vapiInstance.on("speech-end", () => {
            setIsSpeaking(false);
        })

        vapiInstance.on("error", (error) => {
            console.log("Error :" + error);
            setIsConnecting(false);
        });

        vapiInstance.on("message", (message) => {
            if(message.type === "transcript" && message.transcriptType === "final") {
                setTranscript((prev) => [
                    ...prev,
                    {
                        role : message.role === "user" ? "user" : "assistant",
                        text : message.transcript,
                    }
                ])
            }
        });

        return () => {
            vapiInstance?.stop();
        }
    },[]);

    const startCall = () => {
        setIsConnecting(true);
        // Only for testing the vapi API otherwise customer will provide theie own API
        if(vapi) {
            vapi.start("2fd917c2-01c8-4195-9122-a5479f6dac1a");
        }
    }

    const endCall = () => {
        setIsConnecting(true);
        // Only for testing the vapi API otherwise customer will provide theie own API
        if(vapi) {
            vapi.stop();
        }
    };

    return {
        isSpeaking,
        isConnected,
        isConnecting,
        transcript,
        startCall,
        endCall,
    }
}