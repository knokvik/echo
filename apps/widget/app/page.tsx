"use client"

import { useMutation, useQuery } from 'convex/react';
import { api } from "@workspace/backend/_generated/api";
import { Button } from "../../../packages/ui/src/components/button"

export default function Page() {

  const users = useQuery(api.users.getMany);
  const addUser = useMutation(api.users.add);

  return (
    <div className="flex items-center justify-center min-h-svh">
      <div className="flex flex-col items-center justify-center gap-4">
        <Button onClick={()=>addUser()}>ADD</Button>
        {JSON.stringify(users)}
      </div>
    </div>
  )
}
