import type React from "react"
import { NavigationBar } from "@/components/navigation-bar"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <main className="pb-16">{children}</main>
        <NavigationBar />
      </body>
    </html>
  )
}

export const metadata = {
      generator: 'v0.dev'
    };
