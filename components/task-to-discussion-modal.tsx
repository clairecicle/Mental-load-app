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
import { MessageSquare, Copy, ArrowRight, Sparkles } from "lucide-react"

interface TaskToDiscussionModalProps {
  isOpen: boolean
  onClose: () => void
  taskData: {
    title: string
    domain: string
    owner: string
    ownerAvatar: string
    emoji: string
  }
}

export function TaskToDiscussionModal({ isOpen, onClose, taskData }: TaskToDiscussionModalProps) {
  const [discussionTitle, setDiscussionTitle] = useState(`Discussion about: ${taskData.title}`)
  const [discussionDetails, setDiscussionDetails] = useState("")
  const [actionType, setActionType] = useState<"copy" | "convert">("copy")

  const handleSubmit = () => {
    // In real app, this would create the discussion item and optionally remove/convert the task
    console.log("Creating discussion:", {
      title: discussionTitle,
      details: discussionDetails,
      actionType,
      originalTask: taskData,
    })

    // Show success and close modal
    onClose()

    // In real app, you might navigate to the discussion or show a success message
  }

  const getColorForDomain = (domain: string): string => {
    const domainColors: Record<string, string> = {
      "Pet Care": "bg-blue-100",
      "Kitchen Management": "bg-green-100",
      "Bills & Finance": "bg-purple-100",
      Household: "bg-yellow-100",
      Home: "bg-teal-100",
      "Self Care": "bg-pink-100",
    }
    return domainColors[domain] || "bg-gray-100"
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md mx-4 rounded-2xl border-0 shadow-xl font-['Nunito']">
        <DialogHeader className="text-center pb-2">
          <div className="mx-auto w-12 h-12 bg-gradient-to-br from-pink-400 to-purple-500 rounded-full flex items-center justify-center mb-3">
            <MessageSquare className="h-6 w-6 text-white" />
          </div>
          <DialogTitle className="text-xl font-semibold text-gray-900">Start Discussion</DialogTitle>
          <p className="text-sm text-gray-500">Turn this task into a household conversation</p>
        </DialogHeader>

        <div className="space-y-4">
          {/* Original Task Preview */}
          <div className="bg-gray-50 rounded-xl p-3">
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-lg flex items-center justify-center text-lg ${getColorForDomain(taskData.domain)}`}
              >
                {taskData.emoji}
              </div>
              <div className="flex-1">
                <h3 className="font-medium text-gray-900 text-sm">{taskData.title}</h3>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs rounded-full">
                    {taskData.domain}
                  </Badge>
                  <div className="flex items-center gap-1">
                    <Avatar className="h-4 w-4">
                      <AvatarFallback className="text-xs">{taskData.ownerAvatar}</AvatarFallback>
                    </Avatar>
                    <span className="text-xs text-gray-500">{taskData.owner}</span>
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
                        <p className="font-medium text-blue-900 text-sm">Copy to Discussion</p>
                        <p className="text-xs text-blue-700">Keep the task and create a discussion</p>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="flex items-center space-x-3 p-3 bg-purple-50 rounded-xl border border-purple-100">
                  <RadioGroupItem value="convert" id="convert" className="border-purple-300" />
                  <div className="flex-1">
                    <label htmlFor="convert" className="flex items-center gap-2 cursor-pointer">
                      <ArrowRight className="h-4 w-4 text-purple-600" />
                      <div>
                        <p className="font-medium text-purple-900 text-sm">Convert to Discussion</p>
                        <p className="text-xs text-purple-700">Remove the task and create a discussion</p>
                      </div>
                    </label>
                  </div>
                </div>
              </div>
            </RadioGroup>
          </div>

          {/* Discussion Title */}
          <div className="space-y-2">
            <Label htmlFor="discussion-title" className="text-sm font-medium text-gray-700">
              Discussion Title
            </Label>
            <Input
              id="discussion-title"
              value={discussionTitle}
              onChange={(e) => setDiscussionTitle(e.target.value)}
              className="border-gray-200 rounded-xl"
              placeholder="What do you want to discuss?"
            />
          </div>

          {/* Discussion Details */}
          <div className="space-y-2">
            <Label htmlFor="discussion-details" className="text-sm font-medium text-gray-700">
              Discussion Details
            </Label>
            <Textarea
              id="discussion-details"
              value={discussionDetails}
              onChange={(e) => setDiscussionDetails(e.target.value)}
              className="border-gray-200 rounded-xl resize-none"
              rows={3}
              placeholder="What would you like to discuss about this task? Any questions, concerns, or ideas?"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 pt-2">
            <Button onClick={onClose} variant="outline" className="flex-1 rounded-full border-gray-200">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="flex-1 rounded-full bg-gradient-to-r from-pink-500 to-purple-500 hover:from-pink-600 hover:to-purple-600 text-white"
              disabled={!discussionTitle.trim() || !discussionDetails.trim()}
            >
              <Sparkles className="h-4 w-4 mr-1" />
              {actionType === "copy" ? "Create Discussion" : "Convert to Discussion"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
