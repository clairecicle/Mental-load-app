"use client"

import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, MessageSquare, ShoppingCart, Menu } from "lucide-react"
import { cn } from "@/lib/utils"

export function NavigationBar() {
  const pathname = usePathname()

  const navItems = [
    {
      name: "Today",
      href: "/",
      icon: Home,
    },
    {
      name: "Inbox",
      href: "/inbox",
      icon: MessageSquare,
    },
    {
      name: "List",
      href: "/shopping",
      icon: ShoppingCart,
    },
    {
      name: "Menu",
      href: "/menu",
      icon: Menu,
    },
  ]

  return (
    <div className="fixed bottom-0 left-0 right-0 border-t bg-white">
      <div className="mx-auto flex items-center justify-around" style={{ maxWidth: "430px" }}>
        {navItems.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn("flex flex-col items-center py-2 px-4", isActive ? "text-green-600" : "text-gray-500")}
            >
              <item.icon className="h-6 w-6" />
              <span className="text-xs mt-1">{item.name}</span>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
