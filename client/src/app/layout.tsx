import { Inter } from 'next/font/google'
import './globals.css'
import type { Metadata } from 'next'
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Toaster } from "@/components/ui/toaster";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Farcaster Analytics Platform',
  description: 'Dynamic and interactive Web3 data exploration for the Farcaster ecosystem',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL || 'https://clankrank-baseedge.replit.app'),
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      </head>
      <body className={inter.className}>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}