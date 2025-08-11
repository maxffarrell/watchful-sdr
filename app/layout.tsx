import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'QUILL // SDR Intelligence',
  description: 'AI-powered security sales call analysis and discovery optimization platform',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link 
          href="https://fonts.googleapis.com/css2?family=Geist+Mono:wght@400;500;600&display=swap" 
          rel="stylesheet" 
        />
      </head>
      <body className="min-h-screen bg-console-dark text-console-light font-mono antialiased">
        {children}
      </body>
    </html>
  )
}