import { useAtomValue, useSetAtom } from "jotai";
import { WidgetHeader } from "../components/widget.-header";
import { LoaderIcon } from "lucide-react";
import { contactSessionIdAtomFamily, errorMessageAtom, loadingMessageAtom, organizationIdAtom, screenAtom } from "../../atoms/widget-atoms";
import { useEffect, useState } from "react";
import { useAction, useMutation } from "convex/react";
import { api } from "@workspace/backend/_generated/api";

type InitStep = "org" | "session" | "settings" | "vapi" | "done";

export const WidgetLoadingScreen = ({ organizationId } : { organizationId : string | null }) => {

    const[step,setStep] = useState<InitStep>("org");
    const setErrorMessage = useSetAtom(errorMessageAtom);
    const setLoadingMessage = useSetAtom(loadingMessageAtom);
    const setOrganizationId = useSetAtom(organizationIdAtom);
    const [sessionValid,setSessionValid] = useState(false);
    const loadingMessage = useAtomValue(loadingMessageAtom);
    const setScreen = useSetAtom(screenAtom);

    const contactSessionId = useAtomValue(contactSessionIdAtomFamily(organizationId || ""))

    const validateOrganization = useAction(api.public.organizations.validate);

    useEffect(() => {
        if(step != "org") {
            return;
        }
        setLoadingMessage("Loading organizationID...")

        if(!organizationId) {
            setErrorMessage("OrganizationID is requried!")
            setScreen("error");
            return;
        }

        setLoadingMessage("Verifying OrganizationID ")
        validateOrganization({ organizationId })
        .then((result) => {
            if (!result) {
            setErrorMessage("Invalid response from server");
            setScreen("error");
            return;
            }
            if (result.valid) {
            setOrganizationId(organizationId);
            setStep("session")
            } else {
            setErrorMessage( result.reason ||"Invalid Configuration");
            setScreen("error");
            }
        })
        .catch(() => {
            setErrorMessage('Unable to verify organization!')
            setScreen("error")
        })
    },[ step , 
        organizationId , 
        setErrorMessage , 
        setScreen , 
        setOrganizationId , 
        setStep , 
        validateOrganization , 
        setLoadingMessage 
    ])

    // Validate sessions if it exists

    const validateContactSessions = useMutation(api.public.contact_sessions.validate)

    useEffect(() => {
        if(step != "session") {
            return;
        }

        setLoadingMessage("Finding contact session ID...")

        if(!contactSessionId) {
            setSessionValid(false);
            setStep("done");
            return;
        }
        
        console.log(contactSessionId)
        setLoadingMessage("Validating session...")


        validateContactSessions({
            contactSessionId : contactSessionId
        })
        .then(( result )=>{
            setSessionValid( result!.valid );
            setStep("done")
        })
        .catch(() => {
            setSessionValid(false);
            setStep("settings")
        })
    },[ step , contactSessionId , validateContactSessions , setLoadingMessage ])

    useEffect(() => {
        if(step != "done") {
            return;
        }
        const hasValidSession = contactSessionId && sessionValid;
        setScreen(hasValidSession ? "selection" : "auth")
    },[ step , contactSessionId , sessionValid , setScreen ])

    return(
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
        <div className="flex flex-row flex-1 items-center justify-center gap-x-2 p-4 text-muted-foreground">
            <LoaderIcon className="animate-spin"/>
                { loadingMessage || <p>Loading</p> }
        </div>
        </>
    )
}