"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"

interface DiscussionItem {
  id: string
  title: string
  details?: string
  author: string
  authorAvatar: string
  timestamp: string
  isUnread?: boolean
  emoji?: string
  category?: string
}

export function DiscussionInbox() {
  const [activeTab, setActiveTab] = useState("all")
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([])
  const router = useRouter()

  // Sample discussion data
  const sampleDiscussions: DiscussionItem[] = [
    {
      id: "1",
      title: "Should we get a robot vacuum?",
      author: "Alice",
      authorAvatar: "AJ",
      timestamp: "2 hours ago",
      isUnread: true,
      emoji: "🤖",
      category: "Home",
    },
    {
      id: "2",
      title: "Planning summer vacation",
      author: "Bob",
      authorAvatar: "BS",
      timestamp: "Yesterday",
      emoji: "✈️",
      category: "Travel",
    },
    {
      id: "3",
      title: "Kitchen renovation ideas",
      author: "Alice",
      authorAvatar: "AJ",
      timestamp: "2 days ago",
      emoji: "🏠",
      category: "Home",
    },
    {
      id: "4",
      title: "Weekly meal planning",
      author: "Bob",
      authorAvatar: "BS",
      timestamp: "3 days ago",
      emoji: "🍽️",
      category: "Food",
    },
  ]

  useEffect(() => {
    // Load discussions from localStorage or use sample data if none exist
    const storedDiscussions = localStorage.getItem("discussions")
    if (storedDiscussions) {
      const parsedDiscussions = JSON.parse(storedDiscussions)
      setDiscussions([...parsedDiscussions, ...sampleDiscussions])
    } else {
      setDiscussions(sampleDiscussions)
    }
  }, [])

  const getFilteredDiscussions = () => {
    if (activeTab === "all") {
      return discussions
    } else if (activeTab === "unread") {
      return discussions.filter((discussion) => discussion.isUnread)
    } else if (activeTab === "new") {
      return discussions.filter((discussion) => discussion.category === "New")
    }
    return discussions
  }

  const groupedDiscussions = getFilteredDiscussions().reduce<Record<string, DiscussionItem[]>>((groups, discussion) => {
    const category = discussion.category || "Other"
    if (!groups[category]) {
      groups[category] = []
    }
    groups[category].push(discussion)
    return groups
  }, {})

  // Ensure "New" category appears first if it exists
  const sortedCategories = Object.keys(groupedDiscussions).sort((a, b) => {
    if (a === "New") return -1
    if (b === "New") return 1
    if (a === "Other") return -1
    if (b === "Other") return 1
    return a.localeCompare(b)
  })

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 pb-20">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <h1 className="text-xl font-bold text-white">Discussions</h1>
        <p className="text-sm text-white/80">Household conversations</p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="all" className="text-white data-[state=active]:bg-white/30">
              All
            </TabsTrigger>
            <TabsTrigger value="unread" className="text-white data-[state=active]:bg-white/30">
              Unread
            </TabsTrigger>
            <TabsTrigger value="new" className="text-white data-[state=active]:bg-white/30">
              New
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-2">
            {sortedCategories.map((category) => (
              <div key={category} className="space-y-3">
                <div className="flex items-center gap-3">
                  <h2 className="text-sm font-bold text-white/90 uppercase tracking-wider">{category}</h2>
                  <div className="flex-1 h-px bg-white/20"></div>
                </div>

                <div className="space-y-3">
                  {groupedDiscussions[category].map((discussion) => (
                    <div
                      key={discussion.id}
                      className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/10"
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                          {discussion.emoji || "💬"}
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-semibold text-white">{discussion.title}</h3>
                            {discussion.isUnread && <span className="bg-blue-500 w-2 h-2 rounded-full"></span>}
                          </div>
                          <div className="flex items-center gap-2 text-xs text-white/70 mt-1">
                            <div className="flex items-center gap-1">
                              <div className="w-4 h-4 rounded-full bg-gray-100 flex items-center justify-center text-[10px] text-gray-600">
                                {discussion.authorAvatar}
                              </div>
                              <span>{discussion.author}</span>
                            </div>
                            <span>•</span>
                            <span>{discussion.timestamp}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}

            {getFilteredDiscussions().length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-white/60" />
                </div>
                <h3 className="text-white font-medium">No discussions found</h3>
                <p className="text-white/70 text-sm mt-1">Start a new discussion to get the conversation going</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 mx-auto" style={{ maxWidth: "422px", right: "calc(50% - 211px + 10px)" }}>
        <Button
          onClick={() => router.push("/add-discussion")}
          size="icon"
          className="w-14 h-14 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border-2 border-white"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
