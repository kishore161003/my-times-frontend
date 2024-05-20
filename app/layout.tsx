import type { Metadata } from "next"
import { Inter } from "next/font/google"

import "./globals.css"
import NavBar from "@/components/NavBar"
import { ToastProvider } from "@/components/provider/toaster-provider"

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-sans",
})

export const metadata: Metadata = {
  title: "My Times",
  description: "My Times",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" className="bg-gray-200">
      <body className={inter.className}>
        <ToastProvider />
        <div className="flex h-full   flex-col gap-2 bg-gray-200">
          <NavBar />
          <div className="h-full bg-gray-200">{children}</div>
        </div>
      </body>
    </html>
  )
}
