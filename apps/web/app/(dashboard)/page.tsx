"use client"

import { Authenticated, Unauthenticated, useMutation, useQuery } from 'convex/react';
import { api } from "@workspace/backend/_generated/api";
import { OrganizationSwitcher, SignInButton, UserButton } from '@clerk/nextjs';
import { Button } from "../../../../packages/ui/src/components/button"

export default function Page() {

  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <>
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4 text-black">
        <UserButton/> 
        <OrganizationSwitcher hidePersonal={true}/>
        <Button onClick={()=>addUser()}>ADD</Button>
      </div>
    </div>
    </>
  )
}
