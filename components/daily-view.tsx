"use client"

import { useState, useMemo, useEffect, useRef } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Plus } from "lucide-react"
import Link from "next/link"
import { CuteCheckbox } from "@/components/cute-checkbox"
import { UserFilter } from "@/components/user-filter"

interface Task {
  id: string
  title: string
  domain: string
  owner: string
  ownerAvatar: string
  time: string | null
  subtasks: number
  isRecurring?: boolean
  isOverdue?: boolean
  emoji: string
  isNew?: boolean
}

export function DailyView() {
  const [completedTasks, setCompletedTasks] = useState<string[]>([])
  const [selectedUserFilter, setSelectedUserFilter] = useState("alice")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [allTasks, setAllTasks] = useState<Task[]>([])
  const [newTaskId, setNewTaskId] = useState<string | null>(null)

  const newTaskRef = useRef<HTMLDivElement>(null)

  // Initialize tasks
  useEffect(() => {
    setAllTasks(allTodaysTasks)

    // Check for newly created task in localStorage
    const storedTask = localStorage.getItem("newlyCreatedTask")
    if (storedTask) {
      try {
        const newTask = JSON.parse(storedTask) as Task
        setAllTasks((prev) => [newTask, ...prev])
        setNewTaskId(newTask.id)

        // Show toast for new task
        setToastMessage(`Added "${newTask.title}"!`)
        setToastVisible(true)

        // Clear the stored task
        localStorage.removeItem("newlyCreatedTask")

        // Hide toast after 3 seconds
        setTimeout(() => {
          setToastVisible(false)
        }, 3000)
      } catch (e) {
        console.error("Error parsing stored task:", e)
      }
    }
  }, [])

  // Scroll to and flash the new task
  useEffect(() => {
    if (newTaskId && newTaskRef.current) {
      // Scroll to the new task
      setTimeout(() => {
        newTaskRef.current?.scrollIntoView({ behavior: "smooth", block: "center" })
      }, 300)

      // Flash animation
      const element = newTaskRef.current

      // First flash
      setTimeout(() => {
        element.classList.add("bg-green-100")
      }, 500)

      setTimeout(() => {
        element.classList.remove("bg-green-100")
      }, 1000)

      // Second flash
      setTimeout(() => {
        element.classList.add("bg-green-100")
      }, 1500)

      setTimeout(() => {
        element.classList.remove("bg-green-100")
        // Remove the new task flag after animation
        setNewTaskId(null)
      }, 2000)
    }
  }, [newTaskId])

  const toggleTask = (taskId: string) => {
    const task = allTasks.find((t) => t.id === taskId)
    if (!task) return

    if (completedTasks.includes(taskId)) {
      // Unchecking a task
      setCompletedTasks((prev) => prev.filter((id) => id !== taskId))
    } else {
      // Completing a task
      setCompletedTasks((prev) => [...prev, taskId])

      // Show toast
      setToastMessage(`Completed ${task.title}!`)
      setToastVisible(true)

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false)
      }, 3000)
    }
  }

  const allTodaysTasks: Task[] = [
    {
      id: "1",
      title: "Walk Max",
      domain: "Pet Care",
      owner: "Bob",
      ownerAvatar: "BS",
      time: "8:00 AM",
      subtasks: 2,
      isRecurring: true,
      emoji: "🐕",
    },
    {
      id: "2",
      title: "Clean refrigerator",
      domain: "Kitchen Management",
      owner: "Alice",
      ownerAvatar: "AJ",
      time: "2:00 PM",
      subtasks: 3,
      isOverdue: true,
      emoji: "🧹",
    },
    {
      id: "3",
      title: "Pay electricity bill",
      domain: "Bills & Finance",
      owner: "Alice",
      ownerAvatar: "AJ",
      time: "5:00 PM",
      subtasks: 0,
      emoji: "💰",
    },
    {
      id: "6",
      title: "Water plants",
      domain: "Home",
      owner: "Alice",
      ownerAvatar: "AJ",
      time: null, // No specific time
      subtasks: 0,
      emoji: "🪴",
    },
    {
      id: "7",
      title: "Morning meditation",
      domain: "Self Care",
      owner: "Bob",
      ownerAvatar: "BS",
      time: "7:00 AM",
      subtasks: 0,
      emoji: "🧘",
    },
    {
      id: "8",
      title: "Grocery shopping",
      domain: "Household",
      owner: "Bob",
      ownerAvatar: "BS",
      time: "11:00 AM",
      subtasks: 1,
      emoji: "🛒",
    },
    {
      id: "9",
      title: "Prepare dinner",
      domain: "Kitchen Management",
      owner: "Alice",
      ownerAvatar: "AJ",
      time: "6:00 PM",
      subtasks: 2,
      emoji: "🍳",
    },
  ]

  const allUpcomingTasks = [
    {
      id: "10",
      title: "Schedule vet appointment",
      domain: "Pet Care",
      owner: "Alice",
      ownerAvatar: "AJ",
      dueDate: "Tomorrow",
      subtasks: 0,
      emoji: "📅",
    },
    {
      id: "11",
      title: "Fix leaky faucet",
      domain: "Home Maintenance",
      owner: "Bob",
      ownerAvatar: "BS",
      dueDate: "This weekend",
      subtasks: 3,
      emoji: "🔧",
    },
  ]

  // Filter tasks based on selected user
  const filteredTodaysTasks = useMemo(() => {
    if (selectedUserFilter === "all") {
      return allTasks
    }
    const ownerName = selectedUserFilter === "alice" ? "Alice" : "Bob"
    return allTasks.filter((task) => task.owner === ownerName)
  }, [selectedUserFilter, allTasks])

  const filteredUpcomingTasks = useMemo(() => {
    if (selectedUserFilter === "all") {
      return allUpcomingTasks
    }
    const ownerName = selectedUserFilter === "alice" ? "Alice" : "Bob"
    return allUpcomingTasks.filter((task) => task.owner === ownerName)
  }, [selectedUserFilter])

  const groupedTasks = useMemo(() => {
    const now = new Date()
    const currentHour = now.getHours()

    const earlierToday: Task[] = []
    const upNext: Task[] = []
    const anytime: Task[] = []

    // Only include non-completed tasks in the main sections
    const activeTasks = filteredTodaysTasks.filter((task) => !completedTasks.includes(task.id))

    activeTasks.forEach((task) => {
      if (!task.time) {
        anytime.push(task)
        return
      }

      const timeMatch = task.time.match(/(\d+):(\d+)\s*(AM|PM)/i)
      if (!timeMatch) {
        anytime.push(task)
        return
      }

      let hour = Number.parseInt(timeMatch[1])
      const minute = Number.parseInt(timeMatch[2])
      const period = timeMatch[3].toUpperCase()

      if (period === "PM" && hour !== 12) hour += 12
      if (period === "AM" && hour === 12) hour = 0

      const taskHour = hour

      if (taskHour < currentHour) {
        earlierToday.push(task)
      } else {
        upNext.push(task)
      }
    })

    const sortByTime = (a: Task, b: Task) => {
      if (!a.time || !b.time) return 0
      return a.time.localeCompare(b.time)
    }

    return {
      earlierToday: earlierToday.sort(sortByTime),
      upNext: upNext.sort(sortByTime),
      anytime: anytime,
      completed: filteredTodaysTasks.filter((task) => completedTasks.includes(task.id)),
    }
  }, [filteredTodaysTasks, completedTasks])

  const TaskCard = ({ task }: { task: Task }) => {
    const isNewTask = task.id === newTaskId

    return (
      <div ref={isNewTask ? newTaskRef : null} className="transition-colors duration-500">
        <Link href={`/task/${task.id}`}>
          <Card
            className={`${
              completedTasks.includes(task.id) ? "opacity-50" : ""
            } hover:shadow-md transition-all duration-300 overflow-hidden mb-3 border-0 shadow-xl bg-white/95 backdrop-blur-sm`}
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                {/* Emoji/Icon with colored background */}
                <div
                  className={`w-14 h-14 flex items-center justify-center text-2xl ${getColorForDomain(task.domain)}`}
                >
                  {task.emoji}
                </div>

                {/* Task content */}
                <div className="flex-1 py-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold text-base ${
                        completedTasks.includes(task.id) ? "line-through text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                      {task.isOverdue && <span className="ml-2 text-xs font-normal text-red-500">Overdue</span>}
                    </h3>
                    {task.time && <span className="text-sm font-medium text-gray-500 ml-2">{task.time}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{task.domain}</p>
                    {selectedUserFilter === "all" && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">{task.ownerAvatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-500">{task.owner}</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                {/* Cute checkbox */}
                <div
                  className="pr-4"
                  onClick={(e) => {
                    e.preventDefault()
                    e.stopPropagation()
                  }}
                >
                  <CuteCheckbox checked={completedTasks.includes(task.id)} onChange={() => toggleTask(task.id)} />
                </div>
              </div>
            </CardContent>
          </Card>
        </Link>
      </div>
    )
  }

  const SectionHeader = ({ title }: { title: string }) => (
    <div className="flex items-center gap-4 my-6">
      <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">{title}</h2>
      <div className="flex-1 h-px bg-white/30"></div>
    </div>
  )

  const getEmptyStateMessage = () => {
    if (selectedUserFilter === "alice") {
      return {
        emoji: "🎉",
        title: "All caught up!",
        message: "You have no tasks due today. Great job!",
      }
    } else if (selectedUserFilter === "bob") {
      return {
        emoji: "👍",
        title: "Bob's all set!",
        message: "Bob has no tasks due today.",
      }
    } else {
      return {
        emoji: "🏠",
        title: "Household is organized!",
        message: "No tasks due today for anyone. Well done!",
      }
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 pb-16 font-['Nunito']">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div>
          <h1 className="text-xl font-semibold text-white">Today</h1>
          <p className="text-sm text-white/80">The Johnson-Smith Family</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="p-4 space-y-4">
        <Tabs defaultValue="today" className="w-full">
          <TabsList className="grid w-full grid-cols-2 rounded-full bg-white/20 backdrop-blur-sm p-1">
            <TabsTrigger value="today" className="rounded-full data-[state=active]:bg-white/90">
              Due Today
            </TabsTrigger>
            <TabsTrigger value="upcoming" className="rounded-full data-[state=active]:bg-white/90">
              Upcoming
            </TabsTrigger>
          </TabsList>

          {/* User Filter - Only show once, outside of tab content */}
          <div className="mt-4">
            <UserFilter selectedFilter={selectedUserFilter} onFilterChange={setSelectedUserFilter} />
          </div>

          <TabsContent value="today" className="mt-4">
            {/* Earlier Today Section */}
            {groupedTasks.earlierToday.length > 0 && (
              <>
                <SectionHeader title="Earlier Today" />
                {groupedTasks.earlierToday.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Up Next Section */}
            {groupedTasks.upNext.length > 0 && (
              <>
                <SectionHeader title="Up Next" />
                {groupedTasks.upNext.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Anytime Section */}
            {groupedTasks.anytime.length > 0 && (
              <>
                <SectionHeader title="Anytime" />
                {groupedTasks.anytime.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Completed Section */}
            {groupedTasks.completed.length > 0 && (
              <>
                <SectionHeader title="Completed" />
                {groupedTasks.completed.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Empty state */}
            {groupedTasks.earlierToday.length === 0 &&
              groupedTasks.upNext.length === 0 &&
              groupedTasks.anytime.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{getEmptyStateMessage().emoji}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{getEmptyStateMessage().title}</h3>
                  <p className="text-white/80">{getEmptyStateMessage().message}</p>
                </div>
              )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3 mt-4">
            {filteredUpcomingTasks.map((task) => (
              <Link href={`/task/${task.id}`} key={task.id}>
                <Card className="hover:shadow-md transition-shadow border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                  <CardContent className="p-0">
                    <div className="flex items-center">
                      {/* Emoji/Icon with colored background */}
                      <div
                        className={`w-14 h-14 flex items-center justify-center text-2xl ${getColorForDomain(
                          task.domain,
                        )}`}
                      >
                        {task.emoji}
                      </div>

                      {/* Task content */}
                      <div className="flex-1 py-3 px-4">
                        <h3 className="font-semibold text-base text-gray-900 mb-1">{task.title}</h3>
                        <div className="flex items-center gap-2">
                          <p className="text-sm text-gray-500">
                            {task.domain} • {task.dueDate}
                          </p>
                          {selectedUserFilter === "all" && (
                            <>
                              <span className="text-gray-300">•</span>
                              <div className="flex items-center gap-1">
                                <Avatar className="h-4 w-4">
                                  <AvatarFallback className="text-xs">{task.ownerAvatar}</AvatarFallback>
                                </Avatar>
                                <span className="text-sm text-gray-500">{task.owner}</span>
                              </div>
                            </>
                          )}
                        </div>
                      </div>

                      {/* Cute checkbox */}
                      <div className="pr-4">
                        <CuteCheckbox checked={false} onChange={() => {}} />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </Link>
            ))}

            {filteredUpcomingTasks.length === 0 && (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">{getEmptyStateMessage().emoji}</div>
                <h3 className="text-lg font-semibold text-white mb-2">No upcoming tasks</h3>
                <p className="text-white/80">
                  {selectedUserFilter === "alice"
                    ? "You have no upcoming tasks."
                    : selectedUserFilter === "bob"
                      ? "Bob has no upcoming tasks."
                      : "No upcoming tasks for anyone."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button for Add Task */}
      <Link href="/add-task">
        <div className="fixed bottom-20 right-4">
          <Button
            size="lg"
            className="rounded-full shadow-2xl h-14 w-14 p-0 bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-colors"
          >
            <Plus className="h-6 w-6" />
          </Button>
        </div>
      </Link>

      {/* Toast Notification */}
      {toastVisible && (
        <div className="fixed bottom-8 left-4 right-4 z-50">
          <div className="bg-gradient-to-r from-green-400 via-blue-500 to-purple-600 rounded-2xl shadow-lg p-4 mx-auto max-w-sm transform transition-all duration-300 ease-out animate-in slide-in-from-bottom-5">
            <div className="flex items-center justify-between text-white">
              <div className="flex-1">
                <p className="font-semibold text-base">{toastMessage}</p>
              </div>
              <div className="text-3xl ml-3">🎉</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Helper function to get background color based on domain
function getColorForDomain(domain: string): string {
  const domainColors: Record<string, string> = {
    "Pet Care": "bg-blue-100",
    "Kitchen Management": "bg-green-100",
    "Bills & Finance": "bg-purple-100",
    Household: "bg-yellow-100",
    Home: "bg-teal-100",
    "Self Care": "bg-pink-100",
    "Home Maintenance": "bg-orange-100",
  }

  return domainColors[domain] || "bg-gray-100"
}
