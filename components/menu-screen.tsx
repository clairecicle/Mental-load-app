"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import {
  Menu,
  Settings,
  Bell,
  Users,
  Home,
  User,
  HelpCircle,
  LogOut,
  ChevronRight,
  Crown,
  Sparkles,
} from "lucide-react"
import Link from "next/link"

export function MenuScreen() {
  const currentUser = {
    name: "Alice Johnson",
    email: "alice@example.com",
    avatar: "AJ",
    role: "admin",
    streak: 7,
    tasksCompleted: 42,
  }

  const household = {
    name: "The Johnson-Smith Family",
    memberCount: 2,
  }

  const menuSections = [
    {
      title: "Household",
      emoji: "🏠",
      color: "from-blue-400 to-purple-500",
      items: [
        {
          icon: Users,
          label: "Household Settings",
          description: "Manage members and household preferences",
          href: "/household-settings",
          emoji: "👥",
          bgColor: "bg-blue-50",
          iconColor: "text-blue-600",
        },
        {
          icon: Home,
          label: "Domains",
          description: "Organize your task categories",
          href: "/domains",
          emoji: "📂",
          bgColor: "bg-purple-50",
          iconColor: "text-purple-600",
        },
      ],
    },
    {
      title: "Personal",
      emoji: "✨",
      color: "from-pink-400 to-orange-500",
      items: [
        {
          icon: Bell,
          label: "Notification Settings",
          description: "Configure your notification preferences",
          href: "/notification-settings",
          emoji: "🔔",
          bgColor: "bg-pink-50",
          iconColor: "text-pink-600",
        },
        {
          icon: User,
          label: "Profile",
          description: "Edit your personal information",
          href: "/profile",
          emoji: "👤",
          bgColor: "bg-orange-50",
          iconColor: "text-orange-600",
        },
      ],
    },
    {
      title: "Support",
      emoji: "🤝",
      color: "from-green-400 to-teal-500",
      items: [
        {
          icon: HelpCircle,
          label: "Help & Support",
          description: "Get help and contact support",
          href: "/help",
          emoji: "❓",
          bgColor: "bg-green-50",
          iconColor: "text-green-600",
        },
        {
          icon: Settings,
          label: "App Settings",
          description: "General app preferences",
          href: "/app-settings",
          emoji: "⚙️",
          bgColor: "bg-teal-50",
          iconColor: "text-teal-600",
        },
      ],
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-['Nunito']">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-pink-500 rounded-full flex items-center justify-center">
            <Menu className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Menu</h1>
            <p className="text-sm text-gray-500">Settings and preferences</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* User Profile Card */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-br from-indigo-400 via-purple-500 to-pink-500 p-6 text-white">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <Avatar className="h-16 w-16 border-4 border-white/20">
                    <AvatarFallback className="text-2xl font-bold bg-white/20 text-white">
                      {currentUser.avatar}
                    </AvatarFallback>
                  </Avatar>
                  {currentUser.role === "admin" && (
                    <div className="absolute -top-1 -right-1 w-6 h-6 bg-yellow-400 rounded-full flex items-center justify-center">
                      <Crown className="h-3 w-3 text-yellow-800" />
                    </div>
                  )}
                </div>
                <div className="flex-1">
                  <h3 className="text-xl font-bold">{currentUser.name}</h3>
                  <p className="text-white/80 text-sm">{currentUser.email}</p>
                  <p className="text-white/70 text-xs mt-1">{household.name}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 mt-6">
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold">🔥 {currentUser.streak}</div>
                  <div className="text-xs text-white/80">Day Streak</div>
                </div>
                <div className="bg-white/10 rounded-xl p-3 text-center backdrop-blur-sm">
                  <div className="text-2xl font-bold">✅ {currentUser.tasksCompleted}</div>
                  <div className="text-xs text-white/80">Tasks Done</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Sections */}
        {menuSections.map((section) => (
          <div key={section.title} className="space-y-3">
            <div className="flex items-center gap-3 px-2">
              <div
                className={`w-8 h-8 rounded-full bg-gradient-to-r ${section.color} flex items-center justify-center`}
              >
                <span className="text-lg">{section.emoji}</span>
              </div>
              <h2 className="text-lg font-semibold text-gray-800">{section.title}</h2>
            </div>

            <div className="space-y-3">
              {section.items.map((item) => (
                <Link key={item.label} href={item.href}>
                  <Card className="border-0 shadow-sm hover:shadow-md transition-all duration-200 hover:scale-[1.02] overflow-hidden">
                    <CardContent className="p-0">
                      <div className="flex items-center">
                        <div className={`w-16 h-16 ${item.bgColor} flex items-center justify-center text-2xl`}>
                          {item.emoji}
                        </div>
                        <div className="flex-1 p-4">
                          <h3 className="font-semibold text-gray-900 mb-1">{item.label}</h3>
                          <p className="text-sm text-gray-600">{item.description}</p>
                        </div>
                        <div className="pr-4">
                          <div className={`w-8 h-8 ${item.bgColor} rounded-full flex items-center justify-center`}>
                            <ChevronRight className={`h-4 w-4 ${item.iconColor}`} />
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          </div>
        ))}

        {/* Fun Stats Card */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 p-4">
              <div className="flex items-center gap-3 text-white">
                <div className="text-3xl">🎉</div>
                <div>
                  <h3 className="font-bold">You're doing great!</h3>
                  <p className="text-sm text-white/80">Keep up the awesome work managing your household</p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Sign Out */}
        <div className="pt-4">
          <Button
            variant="outline"
            className="w-full justify-start text-red-600 border-red-200 hover:bg-red-50 rounded-2xl h-14 text-base font-medium"
          >
            <div className="w-10 h-10 bg-red-50 rounded-full flex items-center justify-center mr-3">
              <LogOut className="h-5 w-5 text-red-600" />
            </div>
            Sign Out
          </Button>
        </div>

        {/* App Version */}
        <div className="text-center text-xs text-gray-400 pb-8">
          <div className="flex items-center justify-center gap-1">
            <Sparkles className="h-3 w-3" />
            <span>Mental Load App v1.0.0</span>
            <Sparkles className="h-3 w-3" />
          </div>
        </div>
      </div>
    </div>
  )
}
