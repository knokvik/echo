import { OrganizationList } from "@clerk/nextjs";

export const OrgSelectionView = () => {
    return(
        <OrganizationList
        afterCreateOrganizationUrl="/"
        afterSelectPersonalUrl="/"
        skipInvitationScreen
        hidePersonal={true}/>
    )
}