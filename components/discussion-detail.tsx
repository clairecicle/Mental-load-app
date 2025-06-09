"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { ChevronLeft, Edit, Link as LinkIcon, Image, CheckSquare, Paperclip, Save } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { DiscussionToTaskModal } from "@/components/discussion-to-task-modal"

interface DiscussionDetailProps {
  id: string
}

interface DiscussionItem {
  id: string
  title: string
  note?: string
  author: string
  authorAvatar: string
  timestamp: string
  status: "to discuss" | "follow up" | "done"
  emoji?: string
  links?: string[]
  screenshots?: string[]
}

export function DiscussionDetail({ id }: DiscussionDetailProps) {
  const router = useRouter()
  const [discussion, setDiscussion] = useState<DiscussionItem | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [editedTitle, setEditedTitle] = useState("")
  const [editedNote, setEditedNote] = useState("")
  const [editedAuthor, setEditedAuthor] = useState("")
  const [editedStatus, setEditedStatus] = useState<"to discuss" | "follow up" | "done">("to discuss")
  
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false)
  const [newLink, setNewLink] = useState("")
  
  const [isAddScreenshotOpen, setIsAddScreenshotOpen] = useState(false)
  const [newScreenshot, setNewScreenshot] = useState("")
  
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false)

  // Load discussion data
  useEffect(() => {
    // In a real app, this would fetch the discussion from an API
    // For now we'll use localStorage and sample data
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
        links: ["https://www.amazon.com/robot-vacuums/b?node=1055398"],
        screenshots: ["/images/sample-vacuum.jpg"],
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
        links: ["https://www.airbnb.com", "https://www.expedia.com"],
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
        screenshots: ["/images/meal-plan.jpg"],
      },
    ]

    const storedDiscussions = localStorage.getItem("discussions")
    let allDiscussions = sampleDiscussions
    
    if (storedDiscussions) {
      try {
        const parsedDiscussions = JSON.parse(storedDiscussions)
        allDiscussions = [...parsedDiscussions, ...sampleDiscussions]
      } catch (e) {
        console.error("Error parsing stored discussions:", e)
      }
    }

    const foundDiscussion = allDiscussions.find(d => d.id === id)
    
    if (foundDiscussion) {
      setDiscussion(foundDiscussion)
      setEditedTitle(foundDiscussion.title)
      setEditedNote(foundDiscussion.note || "")
      setEditedAuthor(foundDiscussion.author)
      setEditedStatus(foundDiscussion.status)
    }
  }, [id])

  const handleSave = () => {
    if (!discussion) return

    const updatedDiscussion = {
      ...discussion,
      title: editedTitle,
      note: editedNote,
      author: editedAuthor,
      status: editedStatus,
    }

    setDiscussion(updatedDiscussion)
    
    // In a real app, save to backend/API
    // For now, we'll just update localStorage
    const storedDiscussions = localStorage.getItem("discussions")
    let allDiscussions = []
    
    if (storedDiscussions) {
      try {
        allDiscussions = JSON.parse(storedDiscussions)
        const index = allDiscussions.findIndex((d: DiscussionItem) => d.id === id)
        if (index >= 0) {
          allDiscussions[index] = updatedDiscussion
        } else {
          allDiscussions.push(updatedDiscussion)
        }
      } catch (e) {
        console.error("Error updating discussions:", e)
        allDiscussions = [updatedDiscussion]
      }
    } else {
      allDiscussions = [updatedDiscussion]
    }
    
    localStorage.setItem("discussions", JSON.stringify(allDiscussions))
    setIsEditing(false)
  }

  const addLink = () => {
    if (!newLink.trim() || !discussion) return

    const updatedDiscussion = {
      ...discussion,
      links: [...(discussion.links || []), newLink]
    }

    setDiscussion(updatedDiscussion)
    
    // Save to localStorage
    const storedDiscussions = localStorage.getItem("discussions")
    let allDiscussions = []
    
    if (storedDiscussions) {
      try {
        allDiscussions = JSON.parse(storedDiscussions)
        const index = allDiscussions.findIndex((d: DiscussionItem) => d.id === id)
        if (index >= 0) {
          allDiscussions[index] = updatedDiscussion
        } else {
          allDiscussions.push(updatedDiscussion)
        }
      } catch (e) {
        allDiscussions = [updatedDiscussion]
      }
    } else {
      allDiscussions = [updatedDiscussion]
    }
    
    localStorage.setItem("discussions", JSON.stringify(allDiscussions))
    setNewLink("")
    setIsAddLinkOpen(false)
  }

  const addScreenshot = () => {
    if (!newScreenshot.trim() || !discussion) return

    // In a real app, this would upload the image
    // For now, we'll just pretend it's an image URL
    const updatedDiscussion = {
      ...discussion,
      screenshots: [...(discussion.screenshots || []), newScreenshot]
    }

    setDiscussion(updatedDiscussion)
    
    // Save to localStorage
    const storedDiscussions = localStorage.getItem("discussions")
    let allDiscussions = []
    
    if (storedDiscussions) {
      try {
        allDiscussions = JSON.parse(storedDiscussions)
        const index = allDiscussions.findIndex((d: DiscussionItem) => d.id === id)
        if (index >= 0) {
          allDiscussions[index] = updatedDiscussion
        } else {
          allDiscussions.push(updatedDiscussion)
        }
      } catch (e) {
        allDiscussions = [updatedDiscussion]
      }
    } else {
      allDiscussions = [updatedDiscussion]
    }
    
    localStorage.setItem("discussions", JSON.stringify(allDiscussions))
    setNewScreenshot("")
    setIsAddScreenshotOpen(false)
  }

  if (!discussion) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 p-4 flex justify-center items-center">
        <div className="text-white text-center">
          <p>Loading discussion...</p>
        </div>
      </div>
    )
  }

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case "to discuss":
        return "bg-blue-500/70 hover:bg-blue-500/90"
      case "follow up":
        return "bg-amber-500/70 hover:bg-amber-500/90"
      case "done":
        return "bg-green-500/70 hover:bg-green-500/90"
      default:
        return "bg-gray-500/70 hover:bg-gray-500/90"
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-400 via-indigo-500 to-purple-600 pb-20">
      {/* Header with back button */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div className="flex items-center gap-3">
          <Button 
            onClick={() => router.back()} 
            variant="ghost" 
            className="p-0 h-8 w-8 rounded-full text-white"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-white">Discussion Details</h1>
            <p className="text-sm text-white/80">View and manage discussion</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Main content card */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/10">
          {/* Title section */}
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center text-2xl">
                  {discussion.emoji || "💬"}
                </div>
                {isEditing ? (
                  <Input
                    value={editedTitle}
                    onChange={(e) => setEditedTitle(e.target.value)}
                    className="flex-1 bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                    placeholder="Discussion title"
                  />
                ) : (
                  <h2 className="text-xl font-bold text-white">{discussion.title}</h2>
                )}
              </div>
              
              {!isEditing && (
                <Button 
                  onClick={() => setIsEditing(true)} 
                  variant="ghost" 
                  className="p-2 h-8 w-8 rounded-full text-white hover:bg-white/20"
                >
                  <Edit className="h-4 w-4" />
                </Button>
              )}
            </div>

            {/* Status badge */}
            <div className="flex items-center gap-2">
              {isEditing ? (
                <Select value={editedStatus} onValueChange={(value: "to discuss" | "follow up" | "done") => setEditedStatus(value)}>
                  <SelectTrigger className="w-[140px] bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="to discuss">To Discuss</SelectItem>
                    <SelectItem value="follow up">Follow Up</SelectItem>
                    <SelectItem value="done">Done</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <Badge className={`text-white ${getStatusBadgeColor(discussion.status)}`}>
                  {discussion.status === "to discuss" ? "To Discuss" : 
                   discussion.status === "follow up" ? "Follow Up" : "Done"}
                </Badge>
              )}
              
              <span className="text-white/60 text-sm">{discussion.timestamp}</span>
            </div>

            {/* Owner/Author */}
            <div className="flex items-center gap-2">
              <p className="text-white/80 text-sm">Owner:</p>
              
              {isEditing ? (
                <Select value={editedAuthor.toLowerCase()} onValueChange={setEditedAuthor}>
                  <SelectTrigger className="w-[100px] bg-white/20 border-white/30 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="alice">Alice</SelectItem>
                    <SelectItem value="bob">Bob</SelectItem>
                  </SelectContent>
                </Select>
              ) : (
                <div className="flex items-center gap-2">
                  <Avatar className="h-6 w-6">
                    <AvatarFallback className="text-xs bg-white/20 text-white">
                      {discussion.authorAvatar}
                    </AvatarFallback>
                  </Avatar>
                  <span className="text-white">{discussion.author}</span>
                </div>
              )}
            </div>

            {/* Note */}
            <div className="space-y-2">
              <p className="text-white/80 text-sm">Note:</p>
              
              {isEditing ? (
                <Textarea
                  value={editedNote}
                  onChange={(e) => setEditedNote(e.target.value)}
                  className="bg-white/20 border-white/30 text-white placeholder:text-white/50 focus-visible:ring-white/30 min-h-[80px]"
                  placeholder="Add a note..."
                />
              ) : (
                <div className="bg-white/10 rounded-xl p-3 text-white/90">
                  {discussion.note || "No notes added."}
                </div>
              )}
            </div>

            {/* Save button when editing */}
            {isEditing && (
              <Button 
                onClick={handleSave} 
                className="w-full bg-white/20 hover:bg-white/30 text-white border border-white/30"
              >
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </Button>
            )}
          </div>
        </div>

        {/* Links section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Links</h3>
            <Button 
              onClick={() => setIsAddLinkOpen(true)} 
              variant="ghost" 
              className="p-1.5 h-7 rounded-full text-white hover:bg-white/20"
              size="sm"
            >
              <LinkIcon className="h-4 w-4 mr-1" />
              <span className="text-xs">Add</span>
            </Button>
          </div>

          {discussion.links && discussion.links.length > 0 ? (
            <div className="space-y-2">
              {discussion.links.map((link, index) => (
                <div key={index} className="bg-white/10 rounded-xl p-3 flex items-center gap-2">
                  <LinkIcon className="h-4 w-4 text-white/70" />
                  <a 
                    href={link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="text-blue-200 hover:text-blue-100 text-sm truncate flex-1"
                  >
                    {link}
                  </a>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">No links added.</p>
          )}
        </div>

        {/* Screenshots section */}
        <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-4 shadow-sm border border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-lg font-semibold text-white">Screenshots</h3>
            <Button 
              onClick={() => setIsAddScreenshotOpen(true)} 
              variant="ghost" 
              className="p-1.5 h-7 rounded-full text-white hover:bg-white/20"
              size="sm"
            >
              <Image className="h-4 w-4 mr-1" />
              <span className="text-xs">Add</span>
            </Button>
          </div>

          {discussion.screenshots && discussion.screenshots.length > 0 ? (
            <div className="grid grid-cols-2 gap-2">
              {discussion.screenshots.map((screenshot, index) => (
                <div key={index} className="bg-white/10 rounded-xl overflow-hidden aspect-video relative">
                  <img 
                    src={screenshot} 
                    alt={`Screenshot ${index + 1}`} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      // Fallback for missing images
                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/150?text=Image+Not+Found";
                    }}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-white/60 text-sm">No screenshots added.</p>
          )}
        </div>

        {/* Convert to task button */}
        <Button 
          onClick={() => setIsTaskModalOpen(true)} 
          className="w-full bg-gradient-to-r from-green-500 to-blue-500 hover:from-green-600 hover:to-blue-600 text-white py-6 rounded-xl"
        >
          <CheckSquare className="h-5 w-5 mr-2" />
          Convert to Task
        </Button>
      </div>

      {/* Add Link Dialog */}
      <Dialog open={isAddLinkOpen} onOpenChange={setIsAddLinkOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl border-0 shadow-xl bg-white p-6">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-semibold text-gray-900">Add Link</DialogTitle>
            <p className="text-sm text-gray-500">Add a relevant link to this discussion</p>
          </DialogHeader>

          <div className="space-y-4">
            <Input
              value={newLink}
              onChange={(e) => setNewLink(e.target.value)}
              className="border-gray-200 rounded-xl"
              placeholder="https://example.com"
            />

            <Button 
              onClick={addLink} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
              disabled={!newLink.trim()}
            >
              <LinkIcon className="h-4 w-4 mr-2" />
              Add Link
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Add Screenshot Dialog */}
      <Dialog open={isAddScreenshotOpen} onOpenChange={setIsAddScreenshotOpen}>
        <DialogContent className="sm:max-w-md mx-4 rounded-2xl border-0 shadow-xl bg-white p-6">
          <DialogHeader className="text-center pb-2">
            <DialogTitle className="text-xl font-semibold text-gray-900">Add Screenshot</DialogTitle>
            <p className="text-sm text-gray-500">Upload a screenshot to this discussion</p>
          </DialogHeader>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center">
              <Paperclip className="h-8 w-8 mx-auto text-gray-400 mb-2" />
              <p className="text-sm text-gray-500 mb-2">Drag & drop an image here or click to browse</p>
              <Input
                type="file"
                accept="image/*"
                className="hidden"
                id="screenshot-upload"
                onChange={(e) => {
                  if (e.target.files && e.target.files[0]) {
                    // In a real app, upload the file to a server
                    // For now, just pretend it's a URL
                    setNewScreenshot(`/images/uploaded-${Date.now()}.jpg`)
                  }
                }}
              />
              <Button 
                onClick={() => document.getElementById("screenshot-upload")?.click()} 
                variant="outline"
                className="text-sm"
              >
                Browse Files
              </Button>
            </div>

            <Button 
              onClick={addScreenshot} 
              className="w-full bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 text-white rounded-xl"
              disabled={!newScreenshot.trim()}
            >
              <Image className="h-4 w-4 mr-2" />
              Add Screenshot
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Convert to Task Modal */}
      {isTaskModalOpen && discussion && (
        <DiscussionToTaskModal
          isOpen={isTaskModalOpen}
          onClose={() => setIsTaskModalOpen(false)}
          discussionData={{
            title: discussion.title,
            details: discussion.note || "",
            author: discussion.author,
            authorAvatar: discussion.authorAvatar,
            emoji: discussion.emoji || "💬",
            category: "Other", // Not used in new design but required by component
          }}
        />
      )}
    </div>
  )
} 