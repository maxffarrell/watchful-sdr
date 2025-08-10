import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'WATCHFUL // SDR Intelligence',
  description: 'AI-powered call analysis and revenue optimization platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-console-black text-console-white font-mono antialiased">
        {children}
      </body>
    </html>
  )
}