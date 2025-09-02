"use client"

import { useAtomValue } from "jotai"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"
import { screenAtom } from "../../atoms/widget-atoms"

interface Props {
    organizationId : string
};

export const WidgetView = ({ organizationId } : Props) => {
    const screen = useAtomValue(screenAtom)

    const screenComponents = {
        error : <p>TODO : Error</p>,
        loading : <p>TODO : Loading</p>,
        auth : <WidgetAuthScreen/>,
        voice : <p>TODO : Voice</p>,
        inbox : <p>TODO : Inbox</p>,
        selection : <p>Selection : Error</p>,
        chat : <p>TODO : Chat</p>,
        contact : <p>TODO : Contact</p>
    }
    return (
        <main className="flex h-screen w-screen flex-col overflow-hidden rounded-xl border bg-muted">
            {screenComponents[screen as keyof typeof screenComponents]}
        </main>
    )
}