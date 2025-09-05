"use client"

import { glass } from "@dicebear/collection"
import { createAvatar } from "@dicebear/core"
import { useMemo } from "react"
import { Avatar , AvatarImage } from "@radix-ui/react-avatar"
// import { cn } from "../lib/utils.js"

interface DiceBearAvatarProps {
    seed : string,
    size? : number,
    className? : string,
    badgeClassName? : string,
    imageUrl? : string,
    badgeImageUrl? : string,
}

export const DicebearAvatar = ({
    seed,
    size = 32,
    className,
    badgeClassName,
    imageUrl,
    badgeImageUrl
} : DiceBearAvatarProps ) => {
    const avatarSrc = useMemo(() => {
        if( imageUrl ) {
            return imageUrl
        }
        const avatar = createAvatar(glass , {
            seed : seed.toLowerCase().trim(),
            size,
        })

        return avatar.toDataUri();
    }, [])

    const badgeSize = Math.round( size * 0.5 );
    return (
        <div className="relative inline-block" 
             style={{ width : size , height : size }}>
            <Avatar className=""
                    style={{ width : size , height : size }}>
                    <AvatarImage alt="Image" src={avatarSrc}/>
            </Avatar>

            {badgeImageUrl && (
                <div className="flex items-center justify-center overflow-hidden rounded-full border-2 border-background bg-background"
                style={{ width : badgeSize , height : badgeSize    }}>
                    <img alt="" height={badgeSize} width={badgeSize} className="h-full w-full object-cover" src={badgeImageUrl}/>
                </div>
            )}  
        </div>
    )
}