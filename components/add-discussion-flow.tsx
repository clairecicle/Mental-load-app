"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, MessageSquare, X } from "lucide-react"
import { useRouter } from "next/navigation"

export function AddDiscussionFlow() {
  const [discussionTitle, setDiscussionTitle] = useState("")
  const [discussionDetails, setDiscussionDetails] = useState("")

  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const suggestions = [
    { id: "1", title: "Should we get a robot vacuum?", emoji: "🤖" },
    { id: "2", title: "Planning a family vacation", emoji: "✈️" },
    { id: "3", title: "Kitchen renovation ideas", emoji: "🏠" },
    { id: "4", title: "Weekly meal planning discussion", emoji: "🍽️" },
    { id: "5", title: "Pet care scheduling", emoji: "🐕" },
    { id: "6", title: "Budget planning for next month", emoji: "💰" },
    { id: "7", title: "Home organization tips", emoji: "📦" },
    { id: "8", title: "Garden planning for spring", emoji: "🌱" },
    { id: "9", title: "Car maintenance schedule", emoji: "🚗" },
    { id: "10", title: "Holiday gift planning", emoji: "🎁" },
  ]

  const handleSuggestionClick = (suggestion: (typeof suggestions)[0]) => {
    setDiscussionTitle(suggestion.title)

    // Scroll back to top to see the discussion input
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCreateDiscussion = () => {
    if (!discussionTitle.trim()) return

    // Store discussion data in localStorage to simulate persistence
    const newDiscussion = {
      id: `new-${Date.now()}`,
      title: discussionTitle,
      details: discussionDetails,
      author: "Alice", // Default to current user
      authorAvatar: "AJ",
      timestamp: "Just now",
      isUnread: true,
      emoji: "💬",
      category: "New",
    }

    // Get existing discussions or initialize empty array
    const existingDiscussions = JSON.parse(localStorage.getItem("discussions") || "[]")

    // Add new discussion to the beginning of the array
    const updatedDiscussions = [newDiscussion, ...existingDiscussions]

    // Save updated discussions to localStorage
    localStorage.setItem("discussions", JSON.stringify(updatedDiscussions))

    // Navigate back to inbox
    router.push("/inbox")
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 font-['Nunito']">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => router.back()}
            className="rounded-full text-white hover:bg-white/20"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
            <MessageSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">Add New Discussion</h1>
            <p className="text-sm text-white/80">Start a household conversation</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Add Discussion Card */}
        <div ref={formRef}>
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              {/* Discussion Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-purple-500 rounded-2xl flex items-center justify-center">
                  <MessageSquare className="h-6 w-6 text-white" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                  <X className="h-5 w-5 text-gray-400" />
                </Button>
              </div>

              {/* Discussion Title Input */}
              <div>
                <Input
                  placeholder="What would you like to discuss?"
                  value={discussionTitle}
                  onChange={(e) => setDiscussionTitle(e.target.value)}
                  className="text-lg border-none p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Discussion Details */}
              <div>
                <Textarea
                  placeholder="Add more details about your discussion topic..."
                  value={discussionDetails}
                  onChange={(e) => setDiscussionDetails(e.target.value)}
                  className="border-none p-0 focus-visible:ring-0 bg-transparent placeholder:text-gray-400 resize-none min-h-[80px]"
                />
              </div>

              {/* Create Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreateDiscussion}
                  disabled={!discussionTitle.trim()}
                  className="w-full rounded-xl h-12 bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white font-semibold"
                >
                  💬 Start Discussion
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Suggestions */}
        <div className="space-y-4">
          <div className="flex items-center gap-3">
            <h2 className="text-sm font-bold text-white/90 uppercase tracking-wider">Suggestions</h2>
            <div className="flex-1 h-px bg-white/20"></div>
          </div>

          <div className="space-y-3">
            {suggestions.map((suggestion) => (
              <Button
                key={suggestion.id}
                onClick={() => handleSuggestionClick(suggestion)}
                className="w-full h-auto p-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm border-0 rounded-2xl text-left justify-start transition-all duration-200 hover:scale-[1.02]"
              >
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                    {suggestion.emoji}
                  </div>
                  <span className="text-white font-medium text-base">{suggestion.title}</span>
                </div>
              </Button>
            ))}
          </div>
        </div>

        {/* Bottom Spacing */}
        <div className="h-8"></div>
      </div>
    </div>
  )
}
