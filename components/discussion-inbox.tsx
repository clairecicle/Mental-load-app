"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Plus, MessageSquare, Clock, Users } from "lucide-react"
import Link from "next/link"

export function DiscussionInbox() {
  const discussionItems = [
    {
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
    {
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
    {
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
    {
      id: "4",
      title: "Weekly meal planning",
      details: "Should we try that new recipe book we got? I'm thinking we could plan meals for next week together.",
      author: "Bob",
      authorAvatar: "BS",
      timestamp: "5 days ago",
      replies: 2,
      isUnread: false,
      emoji: "🍽️",
      category: "Meal Planning",
    },
    {
      id: "5",
      title: "Summer vacation planning",
      details: "It's time to start thinking about our summer trip. Any preferences for destinations?",
      author: "Alice",
      authorAvatar: "AJ",
      timestamp: "1 week ago",
      replies: 8,
      isUnread: false,
      emoji: "✈️",
      category: "Travel",
    },
  ]

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

  const unreadCount = discussionItems.filter((item) => item.isUnread).length

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 font-['Nunito']">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <MessageSquare className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Discussion Inbox</h1>
              <p className="text-sm text-white/80">
                {unreadCount > 0 ? `${unreadCount} new conversations` : "All caught up!"}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Unread Discussions */}
        {discussionItems.filter((item) => item.isUnread).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 my-6">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold text-sm">!</span>
              </div>
              <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">New</h2>
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="text-sm text-white/80">{discussionItems.filter((item) => item.isUnread).length}</span>
            </div>

            {discussionItems
              .filter((item) => item.isUnread)
              .map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden ring-2 ring-white/30 hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]"
                >
                  <CardContent className="p-0">
                    <div className="flex items-start">
                      <div
                        className={`w-14 h-14 flex items-center justify-center text-2xl ${getCategoryColor(item.category)}`}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-semibold text-gray-900 text-base">{item.title}</h3>
                              <Badge variant="secondary" className="text-xs rounded-full bg-green-100 text-green-700">
                                New
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.details}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{item.authorAvatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{item.author}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{item.timestamp}</span>
                            </div>
                            {item.replies > 0 && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="h-3 w-3" />
                                <span>{item.replies} replies</span>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <Link href={`/discussion/${item.id}/create-task`}>
                              <Button variant="outline" size="sm" className="rounded-full border-gray-200">
                                Create Task
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Earlier Discussions */}
        {discussionItems.filter((item) => !item.isUnread).length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 my-6">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <MessageSquare className="h-4 w-4 text-white" />
              </div>
              <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Earlier</h2>
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="text-sm text-white/80">{discussionItems.filter((item) => !item.isUnread).length}</span>
            </div>

            {discussionItems
              .filter((item) => !item.isUnread)
              .map((item) => (
                <Card
                  key={item.id}
                  className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden hover:shadow-2xl transition-all duration-200 hover:scale-[1.02]"
                >
                  <CardContent className="p-0">
                    <div className="flex items-start">
                      <div
                        className={`w-14 h-14 flex items-center justify-center text-2xl ${getCategoryColor(item.category)}`}
                      >
                        {item.emoji}
                      </div>
                      <div className="flex-1 p-4">
                        <div className="flex items-start justify-between mb-2">
                          <div className="flex-1">
                            <h3 className="font-semibold text-gray-900 text-base mb-1">{item.title}</h3>
                            <p className="text-sm text-gray-600 line-clamp-2 mb-3">{item.details}</p>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-6 w-6">
                                <AvatarFallback className="text-xs">{item.authorAvatar}</AvatarFallback>
                              </Avatar>
                              <span className="text-sm text-gray-600">{item.author}</span>
                            </div>
                            <div className="flex items-center gap-1 text-sm text-gray-500">
                              <Clock className="h-3 w-3" />
                              <span>{item.timestamp}</span>
                            </div>
                            {item.replies > 0 && (
                              <div className="flex items-center gap-1 text-sm text-gray-500">
                                <Users className="h-3 w-3" />
                                <span>{item.replies} replies</span>
                              </div>
                            )}
                          </div>
                          <div className="flex justify-end">
                            <Link href={`/discussion/${item.id}/create-task`}>
                              <Button variant="outline" size="sm" className="rounded-full border-gray-200">
                                Create Task
                              </Button>
                            </Link>
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
          </div>
        )}

        {/* Empty State */}
        {discussionItems.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">💬</div>
            <h3 className="text-lg font-semibold text-white mb-2">No discussions yet</h3>
            <p className="text-white/80">Start a conversation with your household!</p>
          </div>
        )}
      </div>

      {/* Floating New Topic Button */}
      <div className="fixed bottom-20 right-4">
        <Button
          size="lg"
          className="rounded-full shadow-2xl h-14 w-14 p-0 bg-gradient-to-br from-indigo-500 to-purple-600 hover:from-indigo-600 hover:to-purple-700 transition-colors"
        >
          <Plus className="h-6 w-6" />
        </Button>
      </div>
    </div>
  )
}
