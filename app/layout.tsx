import type React from "react"
import type { Metadata, Viewport } from "next"
import Script from "next/script"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import "./globals.css"

export const metadata: Metadata = {
  title: "WHALEZ-AI | AI-Driven Financial Intelligence",
  description:
    "Advanced AI-driven financial intelligence ecosystem. Quantitative analysis, market insights, and systematic strategy development.",
  generator: "v0.app",
  icons: {
    icon: [
      {
        url: "/icon-light-32x32.png",
        media: "(prefers-color-scheme: light)",
      },
      {
        url: "/icon-dark-32x32.png",
        media: "(prefers-color-scheme: dark)",
      },
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
    ],
    apple: "/apple-icon.png",
  },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
  themeColor: "#0d1117",
}

// Only the public widget key belongs in browser configuration. Never expose
// Tidio OpenAPI client secrets through NEXT_PUBLIC_* variables.
const tidioPublicKey = process.env.NEXT_PUBLIC_TIDIO_PUBLIC_KEY?.trim()
const validTidioPublicKey =
  tidioPublicKey && /^[a-zA-Z0-9]+$/.test(tidioPublicKey)
    ? tidioPublicKey
    : undefined

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        {validTidioPublicKey ? (
          <Script
            id="tidio-chat-widget"
            src={`https://code.tidio.co/${validTidioPublicKey}.js`}
            strategy="afterInteractive"
          />
        ) : null}
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
