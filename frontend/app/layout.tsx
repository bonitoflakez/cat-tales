import './globals.css'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Cat tales',
  description: 'Cat tales - Adventure game',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  )
}
