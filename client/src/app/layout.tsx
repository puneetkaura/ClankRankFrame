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
  other: {
    'fc:frame': 'vNext',
    'fc:frame:button:1': "Calculate Clank Rank",
    'fc:frame:input:text': "Enter FID",
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className} suppressHydrationWarning>
        <QueryClientProvider client={queryClient}>
          {children}
          <Toaster />
        </QueryClientProvider>
      </body>
    </html>
  )
}