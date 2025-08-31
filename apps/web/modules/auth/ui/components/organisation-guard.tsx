"use client"

import { useOrganization } from "@clerk/nextjs";
import { AuthLayout } from "../layouts/auth_layout";
import { OrgSelectionView } from "../views/org-selection-list";

export const OrganizationGuard = ({ children } : { children : React.ReactNode}) => {

    const { organization } = useOrganization();
    if(!organization) {
        return(
            <AuthLayout>
                 <OrgSelectionView/>
            </AuthLayout>
        )
    }
    return(
        <>
            {children}
        </>
    )
}