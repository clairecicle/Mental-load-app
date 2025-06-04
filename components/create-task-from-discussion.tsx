"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, CheckSquare, Copy, ArrowRight, Sparkles, Calendar, Clock } from "lucide-react"
import { useRouter } from "next/navigation"

interface CreateTaskFromDiscussionProps {
  discussionId: string
}

export function CreateTaskFromDiscussion({ discussionId }: CreateTaskFromDiscussionProps) {
  const [discussionData, setDiscussionData] = useState<any>(null)
  const [taskTitle, setTaskTitle] = useState("")
  const [taskDetails, setTaskDetails] = useState("")
  const [taskOwner, setTaskOwner] = useState("alice")
  const [taskDomain, setTaskDomain] = useState("Other")
  const [dueDate, setDueDate] = useState("")
  const [dueTime, setDueTime] = useState("")
  const [actionType, setActionType] = useState<"copy" | "convert">("copy")

  const router = useRouter()

  // Load discussion data based on discussionId
  useEffect(() => {
    const discussionMap: Record<string, any> = {
      "1": {
        id: "1",
        title: "Should we get a robot vacuum?",
        details:
          "I saw a good deal on a Roomba. What do you think? It could really help with the daily cleaning routine and save us time on weekends.",
        author: "Bob",
        authorAvatar: "BS",
        timestamp: "2 hours ago",
        replies: 3,
        isUnread: true,
        emoji: "🤖",
        category: "Home Improvement",
      },
      "2": {
        id: "2",
        title: "Planning Max's vet appointment",
        details: "His annual checkup is due. Should we schedule for next week or wait until after the holidays?",
        author: "Alice",
        authorAvatar: "AJ",
        timestamp: "1 day ago",
        replies: 1,
        isUnread: false,
        emoji: "🐕",
        category: "Pet Care",
      },
      "3": {
        id: "3",
        title: "Kitchen renovation ideas",
        details: "I've been thinking about updating the backsplash. Found some nice tile options online.",
        author: "Alice",
        authorAvatar: "AJ",
        timestamp: "3 days ago",
        replies: 5,
        isUnread: false,
        emoji: "🏠",
        category: "Home Improvement",
      },
    }

    const discussion = discussionMap[discussionId]
    if (discussion) {
      setDiscussionData(discussion)
      setTaskTitle(`Task: ${discussion.title}`)
      setTaskDetails(discussion.details)
      setTaskOwner(discussion.author.toLowerCase())
      setTaskDomain(suggestDomain(discussion.category))
    }
  }, [discussionId])

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      "Home Improvement": "bg-blue-100",
      "Pet Care": "bg-purple-100",
      "Meal Planning": "bg-green-100",
      Travel: "bg-yellow-100",
      Finance: "bg-orange-100",
      Health: "bg-pink-100",
      Other: "bg-gray-100",
    }
    return categoryColors[category] || "bg-gray-100"
  }

  // Auto-suggest domain based on discussion category
  const suggestDomain = (category: string): string => {
    const categoryToDomain: Record<string, string> = {
      "Home Improvement": "Home Maintenance",
      "Pet Care": "Pet Care",
      "Meal Planning": "Kitchen Management",
      Travel: "Planning",
      Finance: "Bills & Finance",
      Health: "Self Care",
    }
    return categoryToDomain[category] || "Other"
  }

  const handleSubmit = () => {
    // In real app, this would create the task and optionally remove/convert the discussion
    console.log("Creating task:", {
      title: taskTitle,
      details: taskDetails,
      owner: taskOwner,
      domain: taskDomain,
      dueDate,
      dueTime,
      actionType,
      originalDiscussion: discussionData,
    })

    // Navigate back to inbox or to the new task
    router.push("/inbox")
  }

  if (!discussionData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🔄</div>
          <p className="text-gray-500">Loading discussion...</p>
        </div>
      </div>
    )
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
            <h1 className="text-lg font-semibold text-gray-900">Create Task</h1>
            <p className="text-sm text-gray-500">Turn discussion into actionable task</p>
          </div>
          <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center">
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Original Discussion Preview */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Original Discussion</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 rounded-xl p-4">
              <div className="flex items-center gap-3 mb-3">
                <div
                  className={`w-12 h-12 rounded-lg flex items-center justify-center text-2xl ${getCategoryColor(discussionData.category)}`}
                >
                  {discussionData.emoji}
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{discussionData.title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="outline" className="text-xs rounded-full">
                      {discussionData.category}
                    </Badge>
                    <div className="flex items-center gap-1">
                      <Avatar className="h-5 w-5">
                        <AvatarFallback className="text-xs">{discussionData.authorAvatar}</AvatarFallback>
                      </Avatar>
                      <span className="text-sm text-gray-500">{discussionData.author}</span>
                    </div>
                  </div>
                </div>
              </div>
              <p className="text-sm text-gray-700">{discussionData.details}</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Type Selection */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">What would you like to do?</CardTitle>
          </CardHeader>
          <CardContent>
            <RadioGroup value={actionType} onValueChange={(value) => setActionType(value as "copy" | "convert")}>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-4 bg-blue-50 rounded-xl border border-blue-100">
                  <RadioGroupItem value="copy" id="copy" className="border-blue-300" />
                  <div className="flex-1">
                    <label htmlFor="copy" className="flex items-center gap-3 cursor-pointer">
                      <Copy className="h-5 w-5 text-blue-600" />
                      <div>
                        <p className="font-semibold text-blue-900">Copy to Task</p>
                        <p className="text-sm text-blue-700">Keep the discussion and create a task</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-xl border border-green-100">
                  <RadioGroupItem value="convert" id="convert" className="border-green-300" />
                  <div className="flex-1">
                    <label htmlFor="convert" className="flex items-center gap-3 cursor-pointer">
                      <ArrowRight className="h-5 w-5 text-green-600" />
                      <div>
                        <p className="font-semibold text-green-900">Convert to Task</p>
                        <p className="text-sm text-green-700">Remove the discussion and create a task</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </CardContent>
        </Card>

        {/* Task Details */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Task Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="task-title" className="text-sm font-medium text-gray-700">
                Task Title
              </Label>
              <Input
                id="task-title"
                value={taskTitle}
                onChange={(e) => setTaskTitle(e.target.value)}
                className="mt-1 border-gray-200 rounded-xl"
                placeholder="What needs to be done?"
              />
            </div>

            <div>
              <Label htmlFor="task-details" className="text-sm font-medium text-gray-700">
                Task Details
              </Label>
              <Textarea
                id="task-details"
                value={taskDetails}
                onChange={(e) => setTaskDetails(e.target.value)}
                className="mt-1 border-gray-200 rounded-xl resize-none"
                rows={4}
                placeholder="Add any specific details or requirements..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Assignment */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base">Assignment</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="task-owner" className="text-sm font-medium text-gray-700">
                  Assign To
                </Label>
                <Select value={taskOwner} onValueChange={setTaskOwner}>
                  <SelectTrigger className="mt-1 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice</SelectItem>
                    <SelectItem value="bob">Bob</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="task-domain" className="text-sm font-medium text-gray-700">
                  Domain
                </Label>
                <Select value={taskDomain} onValueChange={setTaskDomain}>
                  <SelectTrigger className="mt-1 border-gray-200 rounded-xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Kitchen Management">Kitchen Management</SelectItem>
                    <SelectItem value="Pet Care">Pet Care</SelectItem>
                    <SelectItem value="Bills & Finance">Bills & Finance</SelectItem>
                    <SelectItem value="Home Maintenance">Home Maintenance</SelectItem>
                    <SelectItem value="Planning">Planning</SelectItem>
                    <SelectItem value="Self Care">Self Care</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Due Date & Time */}
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              When
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="due-date" className="text-sm font-medium text-gray-700">
                  Due Date
                </Label>
                <Input
                  id="due-date"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="mt-1 border-gray-200 rounded-xl"
                />
              </div>
              <div>
                <Label htmlFor="due-time" className="text-sm font-medium text-gray-700">
                  Due Time
                </Label>
                <Input
                  id="due-time"
                  type="time"
                  value={dueTime}
                  onChange={(e) => setDueTime(e.target.value)}
                  className="mt-1 border-gray-200 rounded-xl"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Preview */}
        {taskTitle && (
          <Card className="border-0 shadow-sm bg-gradient-to-r from-green-50 to-blue-50">
            <CardHeader className="pb-3">
              <CardTitle className="text-base flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Task Preview
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-white rounded-xl p-4 border border-green-100">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center text-2xl">✅</div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{taskTitle}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs rounded-full">
                        {taskDomain}
                      </Badge>
                      <div className="flex items-center gap-1">
                        <Avatar className="h-4 w-4">
                          <AvatarFallback className="text-xs">{taskOwner === "alice" ? "AJ" : "BS"}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm text-gray-500">{taskOwner === "alice" ? "Alice" : "Bob"}</span>
                      </div>
                      {dueDate && (
                        <>
                          <span className="text-gray-300">•</span>
                          <div className="flex items-center gap-1">
                            <Clock className="h-3 w-3 text-gray-500" />
                            <span className="text-sm text-gray-500">
                              {new Date(dueDate).toLocaleDateString()}
                              {dueTime && ` at ${dueTime}`}
                            </span>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 pb-8">
          <Button onClick={() => router.back()} variant="outline" className="flex-1 rounded-full border-gray-200">
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="flex-1 rounded-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white"
            disabled={!taskTitle.trim() || !taskDetails.trim()}
          >
            <Sparkles className="h-4 w-4 mr-1" />
            {actionType === "copy" ? "Create Task" : "Convert to Task"}
          </Button>
        </div>
      </div>
    </div>
  )
}
