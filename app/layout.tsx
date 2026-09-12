import type React from "react"
import type { Metadata, Viewport } from "next"
import { Analytics } from "@vercel/analytics/next"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { IntegrationScripts } from "@/components/integration-scripts"
import "./globals.css"

export const metadata: Metadata = {
  title: "WHALEZ-AI Ecosystem | DeltaAlpha-TradePro",
  description:
    "Whalez-AI ecosystem gateway for trading intelligence, communications, banking, settlement, and founder-controlled public beta surfaces.",
  generator: "Whalez-AI",
  icons: {
    icon: [
      {
        url: "/icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/whalezchain-icon.svg",
        type: "image/svg+xml",
      },
      {
        url: "/deltaalpha-icon.svg",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="bg-background">
      <body className="font-sans antialiased">
        {children}
        <IntegrationScripts />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  )
}
