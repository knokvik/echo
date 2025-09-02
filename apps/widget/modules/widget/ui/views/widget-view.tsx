"use client"

// import WidgetFooter from "../components/widget-footer"
// import { WidgetHeader } from "../components/widget.-header"
import { WidgetAuthScreen } from "../screens/widget-auth-screen"

interface Props {
    organizationId : string
};

export const WidgetView = ({ organizationId } : Props) => {
    return (
        <main className="flex h-screen w-screen flex-col overflow-hidden rounded-xl border bg-muted">
            {/* <div className="flex flex-1">
              Widget View : { JSON.stringify(organizationId) }
            </div> */}
            <WidgetAuthScreen/>
            {/* <WidgetFooter/> */}
        </main>
    )
}