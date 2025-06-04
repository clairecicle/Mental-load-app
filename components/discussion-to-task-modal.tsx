"use client"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckSquare, Copy, ArrowRight, Sparkles } from "lucide-react"

interface DiscussionToTaskModalProps {
  isOpen: boolean
  onClose: () => void
  discussionData: {
    title: string
    details: string
    author: string
    authorAvatar: string
    emoji: string
    category: string
  }
}

export function DiscussionToTaskModal({ isOpen, onClose, discussionData }: DiscussionToTaskModalProps) {
  const [taskTitle, setTaskTitle] = useState(`Task: ${discussionData.title}`)
  const [taskDetails, setTaskDetails] = useState(discussionData.details)
  const [taskOwner, setTaskOwner] = useState(discussionData.author.toLowerCase())
  const [taskDomain, setTaskDomain] = useState("Other")
  const [actionType, setActionType] = useState<"copy" | "convert">("copy")

  const handleSubmit = () => {
    // In real app, this would create the task and optionally remove/convert the discussion
    console.log("Creating task:", {
      title: taskTitle,
      details: taskDetails,
      owner: taskOwner,
      domain: taskDomain,
      actionType,
      originalDiscussion: discussionData,
    })

    // Show success and close modal
    onClose()

    // In real app, you might navigate to the task or show a success message
  }

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

  // Set suggested domain when modal opens
  useState(() => {
    setTaskDomain(suggestDomain(discussionData.category))
  })

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl border-0 shadow-xl font-['Nunito']">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-green-400 to-blue-500 rounded-full flex items-center justify-center mb-3">
            <CheckSquare className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">Create Task</DialogTitle>
          <p className="text-sm text-gray-500">Turn this discussion into an actionable task</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Discussion Preview */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getCategoryColor(discussionData.category)}`}
              >
                {discussionData.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">{discussionData.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs rounded-full">
                    {discussionData.category}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">{discussionData.authorAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">{discussionData.author}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Type Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium text-gray-700">What would you like to do?</Label>
            <RadioGroup value={actionType} onValueChange={(value) => setActionType(value as "copy" | "convert")}>
              <div className="space-y-2">
                <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-xl border border-blue-100">
                  <RadioGroupItem value="copy" id="copy" className="border-blue-300" />
                  <div className="flex-1">
                    <label htmlFor="copy" className="flex items-center gap-2 cursor-pointer">
                      <Copy className="h-4 w-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-blue-900 text-sm">Copy to Task</p>
                        <p className="text-xs text-blue-700">Keep the discussion and create a task</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-xl border border-green-100">
                  <RadioGroupItem value="convert" id="convert" className="border-green-300" />
                  <div className="flex-1">
                    <label htmlFor="convert" className="flex items-center gap-2 cursor-pointer">
                      <ArrowRight className="h-4 w-4 text-green-600" />
                      <div>
                        <p className="font-medium text-green-900 text-sm">Convert to Task</p>
                        <p className="text-xs text-green-700">Remove the discussion and create a task</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Task Title */}
          <div className="space-y-2">
            <Label htmlFor="task-title" className="text-sm font-medium text-gray-700">
              Task Title
            </Label>
            <Input
              id="task-title"
              value={taskTitle}
              onChange={(e) => setTaskTitle(e.target.value)}
              className="border-gray-200 rounded-xl"
              placeholder="What needs to be done?"
            />
          </div>

          {/* Task Details */}
          <div className="space-y-2">
            <Label htmlFor="task-details" className="text-sm font-medium text-gray-700">
              Task Details
            </Label>
            <Textarea
              id="task-details"
              value={taskDetails}
              onChange={(e) => setTaskDetails(e.target.value)}
              className="border-gray-200 rounded-xl resize-none"
              rows={3}
              placeholder="Add any specific details or requirements..."
            />
          </div>

          {/* Assignment */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="task-owner" className="text-sm font-medium text-gray-700">
                Assign To
              </Label>
              <Select value={taskOwner} onValueChange={setTaskOwner}>
                <SelectTrigger className="border-gray-200 rounded-xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alice">Alice</SelectItem>
                  <SelectItem value="bob">Bob</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="task-domain" className="text-sm font-medium text-gray-700">
                Domain
              </Label>
              <Select value={taskDomain} onValueChange={setTaskDomain}>
                <SelectTrigger className="border-gray-200 rounded-xl">
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

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-full border-gray-200">
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
      </DialogContent>
    </Dialog>
  )
}
