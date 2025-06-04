"use client"

import { useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Bell, Smartphone, MessageSquare, AlarmClock, Heart, Zap } from "lucide-react"
import { useRouter } from "next/navigation"

export function NotificationSettings() {
  const [settings, setSettings] = useState({
    pushNotifications: true,
    textNotifications: false,
    alarmNotifications: false,
    reminderTiming: "24",
    streakReminders: true,
    partnerThankYou: true,
    taskCompletionNotifications: true,
    discussionNotifications: true,
    shoppingListNotifications: false,
  })

  const router = useRouter()

  const updateSetting = (key: string, value: boolean | string) => {
    setSettings((prev) => ({ ...prev, [key]: value }))
  }

  const notificationTypes = [
    {
      icon: Smartphone,
      title: "Push Notifications",
      description: "Receive notifications on your device",
      key: "pushNotifications",
      emoji: "📱",
      bgColor: "bg-blue-50",
      iconColor: "text-blue-600",
    },
    {
      icon: MessageSquare,
      title: "Text Messages",
      description: "Receive SMS notifications",
      key: "textNotifications",
      emoji: "💬",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      icon: AlarmClock,
      title: "Alarm Notifications",
      description: "Set alarms for important tasks",
      key: "alarmNotifications",
      emoji: "⏰",
      bgColor: "bg-orange-50",
      iconColor: "text-orange-600",
    },
  ]

  const specialNotifications = [
    {
      icon: Zap,
      title: "Streak Reminders",
      description: "Get reminded about your completion streaks",
      key: "streakReminders",
      emoji: "🔥",
      bgColor: "bg-yellow-50",
      iconColor: "text-yellow-600",
    },
    {
      icon: Heart,
      title: "Partner Thank You",
      description: "Receive appreciation notifications from household members",
      key: "partnerThankYou",
      emoji: "💝",
      bgColor: "bg-pink-50",
      iconColor: "text-pink-600",
    },
  ]

  const activityNotifications = [
    {
      title: "Task Completions",
      description: "When household members complete tasks",
      key: "taskCompletionNotifications",
      emoji: "✅",
      bgColor: "bg-green-50",
      iconColor: "text-green-600",
    },
    {
      title: "Discussion Updates",
      description: "New messages in household discussions",
      key: "discussionNotifications",
      emoji: "💬",
      bgColor: "bg-purple-50",
      iconColor: "text-purple-600",
    },
    {
      title: "Shopping List Changes",
      description: "When items are added or purchased",
      key: "shoppingListNotifications",
      emoji: "🛒",
      bgColor: "bg-indigo-50",
      iconColor: "text-indigo-600",
    },
  ]

  return (
    <div className="min-h-screen bg-gray-50 font-['Nunito']">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 bg-gradient-to-br from-pink-400 to-orange-500 rounded-full flex items-center justify-center">
            <Bell className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Notification Settings</h1>
            <p className="text-sm text-gray-500">Customize your alerts</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Notification Types */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-blue-400 to-purple-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🔔</div>
                <div>
                  <h2 className="text-lg font-bold">Notification Types</h2>
                  <p className="text-white/80 text-sm">Choose how you want to be notified</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {notificationTypes.map((item, index) => (
                <div key={item.key}>
                  <Card className="border-0 bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                            <span className="text-2xl">{item.emoji}</span>
                          </div>
                          <div>
                            <Label htmlFor={item.key} className="font-semibold text-gray-900 cursor-pointer">
                              {item.title}
                            </Label>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <Switch
                          id={item.key}
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {index < notificationTypes.length - 1 && <div className="h-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Reminder Timing */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">⏰</div>
                <div>
                  <h2 className="text-lg font-bold">Default Reminder Timing</h2>
                  <p className="text-white/80 text-sm">When to remind you about tasks</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Remind me before tasks are due</Label>
                <Select
                  value={settings.reminderTiming}
                  onValueChange={(value) => updateSetting("reminderTiming", value)}
                >
                  <SelectTrigger className="mt-2 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 hour before</SelectItem>
                    <SelectItem value="6">6 hours before</SelectItem>
                    <SelectItem value="24">24 hours before</SelectItem>
                    <SelectItem value="48">2 days before</SelectItem>
                    <SelectItem value="168">1 week before</SelectItem>
                  </SelectContent>
                </Select>
                <p className="text-xs text-gray-500 mt-2">
                  This will be the default for new tasks. You can customize timing for individual tasks.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Special Notifications */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-pink-400 to-red-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">✨</div>
                <div>
                  <h2 className="text-lg font-bold">Motivation & Appreciation</h2>
                  <p className="text-white/80 text-sm">Feel good notifications</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {specialNotifications.map((item, index) => (
                <div key={item.key}>
                  <Card className="border-0 bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                            <span className="text-2xl">{item.emoji}</span>
                          </div>
                          <div>
                            <Label htmlFor={item.key} className="font-semibold text-gray-900 cursor-pointer">
                              {item.title}
                            </Label>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <Switch
                          id={item.key}
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {index < specialNotifications.length - 1 && <div className="h-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Activity Notifications */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-purple-400 to-indigo-500 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🏠</div>
                <div>
                  <h2 className="text-lg font-bold">Household Activity</h2>
                  <p className="text-white/80 text-sm">Stay updated on household changes</p>
                </div>
              </div>
            </div>
            <div className="p-4 space-y-4">
              {activityNotifications.map((item, index) => (
                <div key={item.key}>
                  <Card className="border-0 bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <div className={`w-12 h-12 ${item.bgColor} rounded-xl flex items-center justify-center`}>
                            <span className="text-2xl">{item.emoji}</span>
                          </div>
                          <div>
                            <Label htmlFor={item.key} className="font-semibold text-gray-900 cursor-pointer">
                              {item.title}
                            </Label>
                            <p className="text-sm text-gray-600">{item.description}</p>
                          </div>
                        </div>
                        <Switch
                          id={item.key}
                          checked={settings[item.key as keyof typeof settings] as boolean}
                          onCheckedChange={(checked) => updateSetting(item.key, checked)}
                        />
                      </div>
                    </CardContent>
                  </Card>
                  {index < activityNotifications.length - 1 && <div className="h-2" />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Test Notifications */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="bg-gradient-to-r from-yellow-400 to-orange-400 p-4 text-white">
              <div className="flex items-center gap-3">
                <div className="text-3xl">🧪</div>
                <div>
                  <h2 className="text-lg font-bold">Test Notifications</h2>
                  <p className="text-white/80 text-sm">Make sure everything works</p>
                </div>
              </div>
            </div>
            <div className="p-4">
              <p className="text-sm text-gray-600 mb-4">Send a test notification to verify your settings</p>
              <div className="grid grid-cols-3 gap-3">
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200 flex flex-col items-center gap-2 h-auto py-3"
                >
                  <span className="text-xl">📱</span>
                  <span className="text-xs">Test Push</span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200 flex flex-col items-center gap-2 h-auto py-3"
                  disabled={!settings.textNotifications}
                >
                  <span className="text-xl">💬</span>
                  <span className="text-xs">Test SMS</span>
                </Button>
                <Button
                  variant="outline"
                  className="rounded-xl border-gray-200 flex flex-col items-center gap-2 h-auto py-3"
                  disabled={!settings.alarmNotifications}
                >
                  <span className="text-xl">⏰</span>
                  <span className="text-xs">Test Alarm</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Save Button */}
        <div className="pt-4 pb-8">
          <Button className="w-full rounded-xl h-14 text-base font-semibold bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600">
            💾 Save Notification Settings
          </Button>
        </div>
      </div>
    </div>
  )
}
