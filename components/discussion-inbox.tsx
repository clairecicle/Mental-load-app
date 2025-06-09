"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Plus, MessageSquare } from "lucide-react"
import { useRouter } from "next/navigation"
import Link from "next/link"

interface DiscussionItem {
  id: string
  title: string
  note?: string
  author: string
  authorAvatar: string
  timestamp: string
  status: "to discuss" | "follow up" | "done"
  emoji?: string
}

export function DiscussionInbox() {
  const [activeTab, setActiveTab] = useState("to discuss")
  const [discussions, setDiscussions] = useState<DiscussionItem[]>([])
  const router = useRouter()

  // Sample discussion data
  const sampleDiscussions: DiscussionItem[] = [
    {
      id: "1",
      title: "Should we get a robot vacuum?",
      note: "Our current vacuum is getting old and not picking up well.",
      author: "Alice",
      authorAvatar: "AJ",
      timestamp: "2 hours ago",
      status: "to discuss",
      emoji: "🤖",
    },
    {
      id: "2",
      title: "Planning summer vacation",
      note: "We should start thinking about where to go this summer.",
      author: "Bob",
      authorAvatar: "BS",
      timestamp: "Yesterday",
      status: "follow up",
      emoji: "✈️",
    },
    {
      id: "3",
      title: "Kitchen renovation ideas",
      note: "Time to update our kitchen appliances and cabinets.",
      author: "Alice",
      authorAvatar: "AJ",
      timestamp: "2 days ago",
      status: "to discuss",
      emoji: "🏠",
    },
    {
      id: "4",
      title: "Weekly meal planning",
      note: "Let's get organized with our meals for the week.",
      author: "Bob",
      authorAvatar: "BS",
      timestamp: "3 days ago",
      status: "done",
      emoji: "🍽️",
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
    return discussions.filter((discussion) => discussion.status === activeTab);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 pb-20">
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <h1 className="text-xl font-bold text-white">Discussions</h1>
        <p className="text-sm text-white/80">Household conversations</p>
      </div>

      <div className="p-4">
        <Tabs defaultValue="to discuss" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid grid-cols-3 mb-4 bg-white/20 backdrop-blur-sm">
            <TabsTrigger value="to discuss" className="text-white data-[state=active]:bg-white/30">
              To Discuss
            </TabsTrigger>
            <TabsTrigger value="follow up" className="text-white data-[state=active]:bg-white/30">
              Follow Up
            </TabsTrigger>
            <TabsTrigger value="done" className="text-white data-[state=active]:bg-white/30">
              Done
            </TabsTrigger>
          </TabsList>

          <TabsContent value={activeTab} className="space-y-6 mt-2">
            <div className="space-y-5">
              {getFilteredDiscussions().map((discussion) => (
                <Link key={discussion.id} href={`/discussion/${discussion.id}`} className="block mb-5">
                  <div
                    className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/10 hover:bg-white/30 transition-colors"
                  >
                    <div className="flex gap-3">
                      <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center text-xl">
                        {discussion.emoji || "💬"}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-white">{discussion.title}</h3>
                        </div>
                        {discussion.note && (
                          <p className="text-sm text-white/80 mt-1">{discussion.note}</p>
                        )}
                        <div className="flex items-center gap-2 text-xs text-white/70 mt-2">
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
                </Link>
              ))}
            </div>

            {getFilteredDiscussions().length === 0 && (
              <div className="text-center py-10">
                <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <MessageSquare className="h-8 w-8 text-white/60" />
                </div>
                <h3 className="text-white font-medium">No discussions found</h3>
                <p className="text-white/70 text-sm mt-1">
                  {activeTab === "to discuss" && "Start a new discussion to get the conversation going"}
                  {activeTab === "follow up" && "No discussions need follow up at this time"}
                  {activeTab === "done" && "You haven't completed any discussions yet"}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button */}
      <div className="fixed bottom-20 right-4 mx-auto" style={{ maxWidth: "422px", right: "calc(50% - 211px + 4px)" }}>
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
