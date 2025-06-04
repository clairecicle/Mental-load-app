"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { ArrowLeft, Plus, Link, Camera, Bell, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import { CuteCheckbox } from "@/components/cute-checkbox"
import { TaskToDiscussionModal } from "@/components/task-to-discussion-modal"

interface TaskDetailProps {
  taskId?: string
}

export function TaskDetail({ taskId }: TaskDetailProps) {
  const [subtasks, setSubtasks] = useState([
    { id: "1", title: "Remove all items from fridge", completed: false, owner: "Alice", ownerAvatar: "AJ" },
    { id: "2", title: "Wipe down shelves", completed: false, owner: "Alice", ownerAvatar: "AJ" },
    { id: "3", title: "Replace items and organize", completed: false, owner: "Alice", ownerAvatar: "AJ" },
  ])

  const [taskData, setTaskData] = useState({
    title: "Clean refrigerator",
    domain: "Kitchen Management",
    details: "Deep clean shelves and drawers. Check expiration dates and organize items by category.",
    dueDate: "2024-01-15",
    dueTime: "14:00",
    emoji: "🧹",
    owner: "Alice",
    ownerAvatar: "AJ",
  })

  const [isDiscussionModalOpen, setIsDiscussionModalOpen] = useState(false)

  const toggleSubtask = (id: string) => {
    setSubtasks((prev) =>
      prev.map((subtask) => (subtask.id === id ? { ...subtask, completed: !subtask.completed } : subtask)),
    )
  }

  const router = useRouter()

  // Load task data based on taskId
  useEffect(() => {
    if (taskId) {
      const taskMap: Record<string, typeof taskData> = {
        "1": {
          title: "Walk Max",
          domain: "Pet Care",
          details: "Morning walk around the neighborhood. Don't forget the poop bags!",
          dueDate: "2024-01-14",
          dueTime: "08:00",
          emoji: "🐕",
          owner: "Bob",
          ownerAvatar: "BS",
        },
        "2": {
          title: "Clean refrigerator",
          domain: "Kitchen Management",
          details: "Deep clean shelves and drawers. Check expiration dates and organize items by category.",
          dueDate: "2024-01-15",
          dueTime: "14:00",
          emoji: "🧹",
          owner: "Alice",
          ownerAvatar: "AJ",
        },
        "3": {
          title: "Pay electricity bill",
          domain: "Bills & Finance",
          details: "Monthly electricity bill payment. Check for any usage spikes.",
          dueDate: "2024-01-15",
          dueTime: "17:00",
          emoji: "💰",
          owner: "Alice",
          ownerAvatar: "AJ",
        },
      }

      if (taskMap[taskId]) {
        setTaskData(taskMap[taskId])
      }
    }
  }, [taskId])

  const getColorForDomain = (domain: string): string => {
    const domainColors: Record<string, string> = {
      "Pet Care": "bg-blue-100",
      "Kitchen Management": "bg-green-100",
      "Bills & Finance": "bg-purple-100 ",
      Household: "bg-yellow-100",
      Home: "bg-teal-100",
      "Self Care": "bg-pink-100",
    }
    return domainColors[domain] || "bg-gray-100"
  }

  return (
    <div className="min-h-screen bg-gray-50 font-['Nunito']">
      {/* Header */}
      <div className="bg-white border-b px-4 py-3">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-gray-900">Task Details</h1>
          </div>
          <Button variant="ghost" size="sm" className="rounded-full" onClick={() => setIsDiscussionModalOpen(true)}>
            <MessageSquare className="h-4 w-4 mr-1" />
            Discuss
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Main Task Card */}
        <Card className="border-0 shadow-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              {/* Emoji with colored background */}
              <div
                className={`w-16 h-16 flex items-center justify-center text-3xl ${getColorForDomain(taskData.domain)}`}
              >
                {taskData.emoji}
              </div>

              {/* Task info */}
              <div className="flex-1 p-4">
                <Input
                  value={taskData.title}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, title: e.target.value }))}
                  className="text-lg font-semibold border-none p-0 h-auto focus-visible:ring-0 bg-transparent"
                />
                <div className="flex items-center gap-2 mt-2">
                  <Badge variant="outline" className="rounded-full text-xs">
                    {taskData.domain}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-5 w-5">
                      <AvatarFallback className="text-xs">{taskData.ownerAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-sm text-gray-500">{taskData.owner}</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Task Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900">Details</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={taskData.details}
              onChange={(e) => setTaskData((prev) => ({ ...prev, details: e.target.value }))}
              className="border-gray-200 rounded-xl resize-none"
              rows={3}
            />
          </CardContent>
        </Card>

        {/* Due Date & Time */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900">When</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Date</Label>
                <Input
                  type="date"
                  value={taskData.dueDate}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, dueDate: e.target.value }))}
                  className="mt-1 border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Time</Label>
                <Input
                  type="time"
                  value={taskData.dueTime}
                  onChange={(e) => setTaskData((prev) => ({ ...prev, dueTime: e.target.value }))}
                  className="mt-1 border-gray-200 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900">Assignment</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-sm font-medium text-gray-700">Domain</Label>
                <Select
                  value={taskData.domain.toLowerCase().replace(" ", "-")}
                  onValueChange={(value) => {
                    const domainMap: Record<string, string> = {
                      "kitchen-management": "Kitchen Management",
                      "pet-care": "Pet Care",
                      "bills-&-finance": "Bills & Finance",
                    }
                    setTaskData((prev) => ({ ...prev, domain: domainMap[value] || value }))
                  }}
                >
                  <SelectTrigger className="mt-1 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="kitchen-management">Kitchen Management</SelectItem>
                    <SelectItem value="pet-care">Pet Care</SelectItem>
                    <SelectItem value="bills-&-finance">Bills & Finance</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Owner</Label>
                <Select defaultValue="alice">
                  <SelectTrigger className="mt-1 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice</SelectItem>
                    <SelectItem value="bob">Bob</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Recurrence */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900">Repeat</h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <Select defaultValue="weekly">
                <SelectTrigger className="border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Never</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <Input
                type="number"
                defaultValue="1"
                placeholder="Every X weeks"
                className="border-gray-200 rounded-xl"
              />
            </div>
          </CardContent>
        </Card>

        {/* Attachments */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900">Attachments</h2>
          </CardHeader>
          <CardContent>
            <div className="flex gap-3">
              <Button variant="outline" size="sm" className="rounded-full border-gray-200">
                <Link className="h-4 w-4 mr-1" />
                Add Link
              </Button>
              <Button variant="outline" size="sm" className="rounded-full border-gray-200">
                <Camera className="h-4 w-4 mr-1" />
                Add Photo
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Subtasks */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Subtasks</h2>
              <Button size="sm" variant="outline" className="rounded-full border-gray-200">
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
          </CardHeader>
          <CardContent className="space-y-3">
            {subtasks.map((subtask) => (
              <div key={subtask.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl">
                <CuteCheckbox checked={subtask.completed} onChange={() => toggleSubtask(subtask.id)} />
                <div className="flex-1">
                  <Input
                    defaultValue={subtask.title}
                    className={`border-none p-0 h-auto focus-visible:ring-0 bg-transparent font-medium ${
                      subtask.completed ? "line-through text-gray-500" : "text-gray-900"
                    }`}
                  />
                  <div className="flex items-center gap-1 mt-1">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">{subtask.ownerAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">{subtask.owner}</span>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Notifications */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <h2 className="text-base font-semibold text-gray-900 flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notifications
            </h2>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <Label className="font-medium text-gray-900">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Get notified on your device</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <Label className="font-medium text-gray-900">Text Messages</Label>
                  <p className="text-sm text-gray-500">Receive SMS reminders</p>
                </div>
                <Switch />
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                <div>
                  <Label className="font-medium text-gray-900">Alarm</Label>
                  <p className="text-sm text-gray-500">Set device alarm</p>
                </div>
                <Switch />
              </div>
            </div>

            <div className="pt-2">
              <Label className="text-sm font-medium text-gray-700">Reminder Timing</Label>
              <Select defaultValue="24">
                <SelectTrigger className="mt-1 border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 hour before</SelectItem>
                  <SelectItem value="6">6 hours before</SelectItem>
                  <SelectItem value="24">24 hours before</SelectItem>
                  <SelectItem value="48">2 days before</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 pb-8">
          <Button className="flex-1 rounded-full bg-green-500 hover:bg-green-600">Save Changes</Button>
          <Button variant="outline" className="rounded-full border-gray-200">
            Snooze
          </Button>
          <Button variant="outline" className="rounded-full border-red-200 text-red-600 hover:bg-red-50">
            Delete
          </Button>
        </div>
      </div>
      {/* Task to Discussion Modal */}
      <TaskToDiscussionModal
        isOpen={isDiscussionModalOpen}
        onClose={() => setIsDiscussionModalOpen(false)}
        taskData={{
          title: taskData.title,
          domain: taskData.domain,
          owner: taskData.owner,
          ownerAvatar: taskData.ownerAvatar,
          emoji: taskData.emoji,
        }}
      />
    </div>
  )
}
