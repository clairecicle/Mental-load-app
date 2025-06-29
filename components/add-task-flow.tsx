"use client"

import { useState, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Plus, Calendar, Repeat, X, CheckSquare, User } from "lucide-react"
import { useRouter } from "next/navigation"
import { useAuthContext } from "@/components/AuthProvider"
import { createTask, CreateTaskData } from "@/firebase/services/taskService"

export function AddTaskFlow() {
  const [taskTitle, setTaskTitle] = useState("")
  const [selectedDomain, setSelectedDomain] = useState("")
  const [selectedOwner, setSelectedOwner] = useState("alice") // Default to current user
  const [dueDate, setDueDate] = useState(new Date().toISOString().split("T")[0]) // Today
  const [frequency, setFrequency] = useState("none")
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const formRef = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const { firestoreUser } = useAuthContext();

  const domains = [
    { id: "kitchen", name: "Kitchen Management", emoji: "🍳", color: "text-green-600" },
    { id: "pet-care", name: "Pet Care", emoji: "🐕", color: "text-blue-600" },
    { id: "bills", name: "Bills & Finance", emoji: "💰", color: "text-purple-600" },
    { id: "home", name: "Home Maintenance", emoji: "🔧", color: "text-orange-600" },
    { id: "self-care", name: "Self Care", emoji: "🧘", color: "text-pink-600" },
    { id: "household", name: "Household", emoji: "🏠", color: "text-teal-600" },
  ]

  const owners = [
    { id: "alice", name: "Alice", avatar: "AJ" },
    { id: "bob", name: "Bob", avatar: "BS" },
  ]

  const suggestions = [
    { id: "1", title: "Wash the dishes", emoji: "🍽️", domain: "kitchen" },
    { id: "2", title: "Tidy the living room", emoji: "🛋️", domain: "household" },
    { id: "3", title: "Walk the dog", emoji: "🐕", domain: "pet-care" },
    { id: "4", title: "Take out the trash", emoji: "🗑️", domain: "household" },
    { id: "5", title: "Make the bed", emoji: "🛏️", domain: "household" },
    { id: "6", title: "Water the plants", emoji: "🪴", domain: "household" },
    { id: "7", title: "Clean the bathroom", emoji: "🚿", domain: "household" },
    { id: "8", title: "Do laundry", emoji: "👕", domain: "household" },
    { id: "9", title: "Vacuum the floors", emoji: "🧹", domain: "household" },
    { id: "10", title: "Prepare dinner", emoji: "🍳", domain: "kitchen" },
    { id: "11", title: "Pay monthly bills", emoji: "💳", domain: "bills" },
    { id: "12", title: "Exercise for 30 minutes", emoji: "💪", domain: "self-care" },
    { id: "13", title: "Meditate", emoji: "🧘", domain: "self-care" },
    { id: "14", title: "Read for 20 minutes", emoji: "📚", domain: "self-care" },
    { id: "15", title: "Call a family member", emoji: "📞", domain: "self-care" },
  ]

  const frequencyOptions = [
    { value: "none", label: "Does not repeat" },
    { value: "daily", label: "Daily" },
    { value: "weekly", label: "Weekly" },
    { value: "monthly", label: "Monthly" },
    { value: "custom", label: "Custom" },
  ]

  const handleSuggestionClick = (suggestion: (typeof suggestions)[0]) => {
    setTaskTitle(suggestion.title)
    setSelectedDomain(suggestion.domain)

    // Scroll back to top to see the task input
    if (formRef.current) {
      formRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }

  const handleCreateTask = async () => {
    if (!taskTitle.trim() || !selectedDomain || !firestoreUser) {
      console.log("❌ Debug: Missing required fields:", {
        taskTitle: taskTitle.trim(),
        selectedDomain,
        firestoreUser: !!firestoreUser
      });
      return;
    }
    
    console.log("🔥 Debug: Starting task creation...");
    setIsSaving(true);
    setError(null);
    setSuccess(false);

    const domainObj = domains.find((d) => d.id === selectedDomain);
    const ownerObj = owners.find((o) => o.id === selectedOwner);

    const newTask: CreateTaskData = {
      title: taskTitle,
      domainId: selectedDomain,
      domainName: domainObj ? domainObj.name : "Household",
      ownerId: firestoreUser.uid,
      ownerName: firestoreUser.displayName || ownerObj?.name || "User",
      ownerAvatar: ownerObj?.avatar || "U",
      dueDate: dueDate,
      emoji: domainObj ? domainObj.emoji : "🏠",
    };

    console.log("🔥 Debug: Task data to create:", newTask);

    try {
      const createdTask = await createTask(newTask, "default");
      console.log("✅ Debug: Task created successfully:", createdTask);
      setSuccess(true);
      setTimeout(() => {
        console.log("🔄 Debug: Redirecting to home...");
        router.push("/");
      }, 1000);
    } catch (err) {
      console.error("❌ Debug: Failed to create task:", err);
      setError("Failed to create task. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const getFrequencyIcon = () => {
    if (frequency === "none") return <X className="h-4 w-4 text-gray-500" />
    return <Repeat className="h-4 w-4 text-green-600" />
  }

  const getFrequencyLabel = () => {
    const option = frequencyOptions.find((opt) => opt.value === frequency)
    return option?.label || "Does not repeat"
  }

  const getDomainDisplay = () => {
    if (!selectedDomain) return "Add to a domain"
    const domain = domains.find((d) => d.id === selectedDomain)
    return domain ? `${domain.emoji} ${domain.name}` : "Add to a domain"
  }

  const getOwnerDisplay = () => {
    const owner = owners.find((o) => o.id === selectedOwner)
    return owner ? `${owner.name}` : "Assign to"
  }

  const getDomainName = (domainId: string) => {
    const domain = domains.find((d) => d.id === domainId)
    return domain ? domain.name : "Household"
  }

  const getDomainEmoji = (domainId: string) => {
    const domain = domains.find((d) => d.id === domainId)
    return domain ? domain.emoji : "🏠"
  }

  const getOwnerName = (ownerId: string) => {
    const owner = owners.find((o) => o.id === ownerId)
    return owner ? owner.name : "Alice"
  }

  const getOwnerAvatar = (ownerId: string) => {
    const owner = owners.find((o) => o.id === ownerId)
    return owner ? owner.avatar : "AJ"
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-teal-500 to-blue-500 font-['Nunito']">
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
            <CheckSquare className="h-5 w-5 text-white" />
          </div>
          <div className="flex-1">
            <h1 className="text-lg font-semibold text-white">Add New Task</h1>
            <p className="text-sm text-white/80">Create a new household task</p>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Add Task Card */}
        <div ref={formRef}>
          <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
            <CardContent className="p-6 space-y-4">
              {/* Task Icon */}
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-teal-500 rounded-2xl flex items-center justify-center">
                  <CheckSquare className="h-6 w-6 text-white" />
                </div>
                <Button variant="ghost" size="icon" onClick={() => router.back()} className="rounded-full">
                  <X className="h-5 w-5 text-gray-400" />
                </Button>
              </div>

              {/* Task Input */}
              <div>
                <Input
                  placeholder="Add a new task..."
                  value={taskTitle}
                  onChange={(e) => setTaskTitle(e.target.value)}
                  className="text-lg border-none p-0 h-auto focus-visible:ring-0 bg-transparent placeholder:text-gray-400 font-medium"
                />
              </div>

              {/* Domain Selection */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center">
                  <Plus className="h-4 w-4 text-green-600" />
                </div>
                <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                  <SelectTrigger className="border-none p-0 h-auto focus:ring-0 bg-transparent text-gray-600">
                    <SelectValue placeholder={getDomainDisplay()} />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain.id} value={domain.id}>
                        <div className="flex items-center gap-2">
                          <span>{domain.emoji}</span>
                          <span>{domain.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Owner Selection */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 bg-pink-100 rounded-lg flex items-center justify-center">
                  <User className="h-4 w-4 text-pink-600" />
                </div>
                <Select value={selectedOwner} onValueChange={setSelectedOwner}>
                  <SelectTrigger className="border-none p-0 h-auto focus:ring-0 bg-transparent text-gray-600">
                    <SelectValue placeholder={getOwnerDisplay()} />
                  </SelectTrigger>
                  <SelectContent>
                    {owners.map((owner) => (
                      <SelectItem key={owner.id} value={owner.id}>
                        <div className="flex items-center gap-2">
                          <div className="w-5 h-5 rounded-full bg-gray-100 flex items-center justify-center text-xs">
                            {owner.avatar}
                          </div>
                          <span>{owner.name}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Due Date */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-4 w-4 text-blue-600" />
                </div>
                <Input
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                  className="border-none p-0 h-auto focus-visible:ring-0 bg-transparent text-gray-600"
                />
              </div>

              {/* Frequency */}
              <div className="flex items-center gap-3 py-2">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                  {getFrequencyIcon()}
                </div>
                <Select value={frequency} onValueChange={setFrequency}>
                  <SelectTrigger className="border-none p-0 h-auto focus:ring-0 bg-transparent text-gray-600">
                    <SelectValue placeholder={getFrequencyLabel()} />
                  </SelectTrigger>
                  <SelectContent>
                    {frequencyOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Create Button */}
              <div className="pt-4">
                <Button
                  onClick={handleCreateTask}
                  disabled={!taskTitle.trim()}
                  className="w-full rounded-xl h-12 bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 text-white font-semibold"
                >
                  ✨ Create Task
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
