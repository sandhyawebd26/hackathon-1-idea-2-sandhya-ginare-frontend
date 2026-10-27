import type { Metadata, Viewport } from 'next'
import { GeistMono } from 'geist/font/mono'
import { GeistSans } from 'geist/font/sans'
import type { ReactNode } from 'react'

import '@/app/globals.css'
import { SiteHeader } from '@/components/SiteHeader'
import { Providers } from '@/components/providers'
import { Toaster } from '@/components/ui/sonner'
import { cn } from '@/lib/utils'

export const metadata: Metadata = {
  metadataBase: process.env.VERCEL_URL
    ? new URL(`https://${process.env.VERCEL_URL}`)
    : undefined,
  title: {
    default: 'A Una Milla',
    template: '%s | A Una Milla'
  },
  description: 'Same trip. Much less money.',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon-16x16.png',
    apple: '/apple-touch-icon.png'
  }
}

export const viewport: Viewport = {
  themeColor: '#F9F6F1'
}

interface RootLayoutProps {
  children: ReactNode
}

export default function RootLayout({ children }: RootLayoutProps) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn('font-sans antialiased', GeistSans.variable, GeistMono.variable)}>
        <Providers
          attribute="class"
          defaultTheme="light"
          forcedTheme="light"
          enableSystem={false}
          disableTransitionOnChange
        >
          <div className="min-h-screen bg-background text-foreground">
            <div className="mx-auto flex min-h-screen w-full max-w-6xl flex-col px-4 sm:px-6">
              <SiteHeader />
              <main className="flex flex-1 flex-col">{children}</main>
            </div>
          </div>
          <Toaster position="top-center" />
        </Providers>
      </body>
    </html>
  )
}
