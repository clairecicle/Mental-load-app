import type React from "react"
import { NavigationBar } from "@/components/navigation-bar"
import { NotificationPermission } from "@/components/notification-permission"
import { AuthProvider } from "@/components/AuthProvider"
import "./globals.css"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link
          href="https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body>
        <AuthProvider>
          <div className="mx-auto" style={{ maxWidth: "430px",  }}>
            <main className="pb-16">{children}</main>
            <NavigationBar />
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}

export const metadata = {
  generator: "v0.dev",
}
