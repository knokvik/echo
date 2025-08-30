"use client"

import * as React from "react"
import { useAuth } from '@clerk/nextjs'
import { ThemeProvider as NextThemesProvider } from "next-themes"
import { ConvexReactClient } from "convex/react"
import { ConvexProviderWithClerk } from 'convex/react-clerk'

if (!process.env.NEXT_PUBLIC_CONVEX_URL) {
  throw new Error('Missing NEXT_PUBLIC_CONVEX_URL in your .env file')
}

export function Providers({ children }: { children: React.ReactNode }) {
  const convex = new ConvexReactClient(process.env.NEXT_PUBLIC_CONVEX_URL || "");
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
      enableColorScheme
    >
      <ConvexProviderWithClerk client={convex} useAuth={useAuth}>
          {children}
      </ConvexProviderWithClerk>
    </NextThemesProvider>
  )
}
