import type { Metadata } from "next"
import { Geist, Geist_Mono, Space_Grotesk } from "next/font/google"
import "./globals.css"

const sans = Geist({
  variable: "--font-sans",
  subsets: ["latin"],
})

const mono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
})

// Display face — engineered, slightly technical letterforms that pair with the
// mono label voice. Used with restraint for headlines + concept titles.
const display = Space_Grotesk({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
})

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.howreactnativeworks.com"
const DESCRIPTION =
  "Watch React Native concepts drawn out step by step — the Bridge, JSI, Fabric, Hermes and more. Understand how it works, not just how to use it."

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "How React Native Works — visual explanations",
    template: "%s · How React Native Works",
  },
  description: DESCRIPTION,
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "How React Native Works",
    title: "How React Native Works — visual explanations",
    description: DESCRIPTION,
    url: "/",
  },
  twitter: {
    card: "summary_large_image",
    title: "How React Native Works — visual explanations",
    description: DESCRIPTION,
  },
}

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      className={`${sans.variable} ${mono.variable} ${display.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  )
}
