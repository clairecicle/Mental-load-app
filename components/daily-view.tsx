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
import { useFirestoreTasks } from "@/hooks/useFirestoreTasks"
import { useAuthContext } from "@/components/AuthProvider"
import { FirestoreTask } from "@/firebase/services/taskService"

export function DailyView() {
  const { firestoreUser } = useAuthContext();
  const [selectedUserFilter, setSelectedUserFilter] = useState("all")
  const [toastVisible, setToastVisible] = useState(false)
  const [toastMessage, setToastMessage] = useState("")
  const [newTaskId, setNewTaskId] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("today") // Track active tab

  const newTaskRef = useRef<HTMLDivElement>(null)

  // Use Firestore tasks hook for today's tasks - only when today tab is active
  const {
    tasks: todayTasks,
    loading: todayLoading,
    error: todayError,
    completedTasks: todayCompletedTasks,
    groupedTasks: todayGroupedTasks,
    toggleTask: toggleTodayTask,
    clearError: clearTodayError
  } = useFirestoreTasks({
    householdId: "default",
    userId: undefined,
    filterToday: activeTab === "today",
    realtime: activeTab === "today"
  });

  // Use Firestore tasks hook for upcoming tasks - only when upcoming tab is active
  const {
    tasks: upcomingTasks,
    loading: upcomingLoading,
    error: upcomingError,
    toggleTask: toggleUpcomingTask,
    clearError: clearUpcomingError
  } = useFirestoreTasks({
    householdId: "default",
    userId: undefined,
    filterUpcoming: activeTab === "upcoming",
    realtime: activeTab === "upcoming"
  });

  // Use the appropriate data based on active tab
  const tasks = activeTab === "today" ? todayTasks : upcomingTasks;
  const loading = activeTab === "today" ? todayLoading : upcomingLoading;
  const error = activeTab === "today" ? todayError : upcomingError;
  const completedTasks = activeTab === "today" ? todayCompletedTasks : [];
  const groupedTasks = activeTab === "today" ? todayGroupedTasks : { earlierToday: [], upNext: [], anytime: [], completed: [] };
  const toggleTask = activeTab === "today" ? toggleTodayTask : toggleUpcomingTask;
  const clearError = activeTab === "today" ? clearTodayError : clearUpcomingError;

  // Debug user authentication
  useEffect(() => {
    console.log("👤 Debug: firestoreUser in daily view:", firestoreUser);
    console.log("👤 Debug: firestoreUser.uid:", firestoreUser?.uid);
    console.log("👤 Debug: selectedUserFilter:", selectedUserFilter);
    console.log("📅 Debug: activeTab:", activeTab);
    console.log("📅 Debug: today tasks:", todayTasks.length);
    console.log("📅 Debug: upcoming tasks:", upcomingTasks.length);
  }, [firestoreUser, selectedUserFilter, activeTab, todayTasks, upcomingTasks]);

  // Filter tasks based on selected user
  const filteredTasks = useMemo(() => {
    console.log("🔍 Debug: Filtering tasks. All tasks:", tasks.length);
    
    if (selectedUserFilter === "all") {
      console.log("🔍 Debug: Showing all tasks");
      return tasks;
    }
    
    // For now, since we don't have a proper user mapping, let's show all tasks
    // TODO: Implement proper user filtering when household structure is ready
    console.log("🔍 Debug: User filter selected but showing all tasks for now");
    return tasks;
  }, [tasks, selectedUserFilter]);

  // Filter grouped tasks based on selected user  
  const filteredGroupedTasks = useMemo(() => {
    console.log("🔍 Debug: Filtering grouped tasks");
    
    if (selectedUserFilter === "all") {
      return groupedTasks;
    }
    
    // For now, return all grouped tasks since we don't have proper user mapping
    // TODO: Implement proper user filtering when household structure is ready
    return groupedTasks;
  }, [groupedTasks, selectedUserFilter]);

  // Handle task completion
  const handleToggleTask = async (taskId: string) => {
    const task = tasks.find((t) => t.id === taskId);
    if (!task) return;

    const success = await toggleTask(taskId);
    
    if (success) {
      // Show toast
      const isCompleted = !task.isCompleted;
      setToastMessage(isCompleted ? `Completed ${task.title}!` : `Uncompleted ${task.title}`);
      setToastVisible(true);

      // Hide toast after 3 seconds
      setTimeout(() => {
        setToastVisible(false);
      }, 3000);
    }
  };

  // Check for newly created task in localStorage (for add task flow)
  useEffect(() => {
    const storedTask = localStorage.getItem("newlyCreatedTask");
    if (storedTask) {
      try {
        const newTask = JSON.parse(storedTask);
        setNewTaskId(newTask.id);

        // Show toast for new task
        setToastMessage(`Added "${newTask.title}"!`);
        setToastVisible(true);

        // Clear the stored task
        localStorage.removeItem("newlyCreatedTask");

        // Hide toast after 3 seconds
        setTimeout(() => {
          setToastVisible(false);
        }, 3000);
      } catch (e) {
        console.error("Error parsing stored task:", e);
      }
    }
  }, []);

  // Scroll to and flash the new task
  useEffect(() => {
    if (newTaskId && newTaskRef.current) {
      // Scroll to the new task
      setTimeout(() => {
        newTaskRef.current?.scrollIntoView({ behavior: "smooth", block: "center" });
      }, 300);

      // Flash animation
      const element = newTaskRef.current;

      // First flash
      setTimeout(() => {
        element.classList.add("bg-green-100");
      }, 500);

      setTimeout(() => {
        element.classList.remove("bg-green-100");
      }, 1000);

      // Second flash
      setTimeout(() => {
        element.classList.add("bg-green-100");
      }, 1500);

      setTimeout(() => {
        element.classList.remove("bg-green-100");
        // Remove the new task flag after animation
        setNewTaskId(null);
      }, 2000);
    }
  }, [newTaskId]);

  // Show error toast if there's an error
  useEffect(() => {
    if (error) {
      setToastMessage(`Error: ${error}`);
      setToastVisible(true);
      setTimeout(() => {
        setToastVisible(false);
        clearError();
      }, 5000);
    }
  }, [error, clearError]);

  const TaskCard = ({ task }: { task: FirestoreTask }) => {
    const isNewTask = task.id === newTaskId;
    const isCompleted = completedTasks.includes(task.id);

    return (
      <div ref={isNewTask ? newTaskRef : null} className="transition-colors duration-500">
        <Link href={`/task/${task.id}`}>
          <Card
            className={`${
              isCompleted ? "opacity-50" : ""
            } hover:shadow-md transition-all duration-300 overflow-hidden mb-3 border-0 shadow-xl bg-white/95 backdrop-blur-sm`}
          >
            <CardContent className="p-0">
              <div className="flex items-center">
                {/* Emoji/Icon with colored background */}
                <div
                  className={`w-14 h-14 flex items-center justify-center text-2xl ${getColorForDomain(task.domainName)}`}
                >
                  {task.emoji}
                </div>

                {/* Task content */}
                <div className="flex-1 py-3 px-4">
                  <div className="flex items-center justify-between mb-1">
                    <h3
                      className={`font-semibold text-base ${
                        isCompleted ? "line-through text-gray-500" : "text-gray-900"
                      }`}
                    >
                      {task.title}
                      {task.isOverdue && <span className="ml-2 text-xs font-normal text-red-500">Overdue</span>}
                    </h3>
                    {task.dueTime && <span className="text-sm font-medium text-gray-500 ml-2">{task.dueTime}</span>}
                  </div>
                  <div className="flex items-center gap-2">
                    <p className="text-sm text-gray-500">{task.domainName}</p>
                    {selectedUserFilter === "all" && (
                      <>
                        <span className="text-gray-300">•</span>
                        <div className="flex items-center gap-1">
                          <Avatar className="h-4 w-4">
                            <AvatarFallback className="text-xs">{task.ownerAvatar}</AvatarFallback>
                          </Avatar>
                          <span className="text-sm text-gray-500">{task.ownerName}</span>
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
                  <CuteCheckbox checked={isCompleted} onChange={() => handleToggleTask(task.id)} />
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

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-400 via-pink-500 to-red-500 pb-16 font-['Nunito'] flex items-center justify-center">
        <div className="text-center text-white">
          <div className="text-4xl mb-4">⏳</div>
          <p className="text-lg">Loading your tasks...</p>
        </div>
      </div>
    );
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
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
            {filteredGroupedTasks.earlierToday.length > 0 && (
              <>
                <SectionHeader title="Earlier Today" />
                {filteredGroupedTasks.earlierToday.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Up Next Section */}
            {filteredGroupedTasks.upNext.length > 0 && (
              <>
                <SectionHeader title="Up Next" />
                {filteredGroupedTasks.upNext.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Anytime Section */}
            {filteredGroupedTasks.anytime.length > 0 && (
              <>
                <SectionHeader title="Anytime" />
                {filteredGroupedTasks.anytime.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Completed Section */}
            {filteredGroupedTasks.completed.length > 0 && (
              <>
                <SectionHeader title="Completed" />
                {filteredGroupedTasks.completed.map((task) => (
                  <TaskCard key={task.id} task={task} />
                ))}
              </>
            )}

            {/* Empty state */}
            {filteredGroupedTasks.earlierToday.length === 0 &&
              filteredGroupedTasks.upNext.length === 0 &&
              filteredGroupedTasks.anytime.length === 0 && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4">{getEmptyStateMessage().emoji}</div>
                  <h3 className="text-lg font-semibold text-white mb-2">{getEmptyStateMessage().title}</h3>
                  <p className="text-white/80">{getEmptyStateMessage().message}</p>
                </div>
              )}
          </TabsContent>

          <TabsContent value="upcoming" className="space-y-3 mt-4">
            {upcomingLoading ? (
              <div className="text-center py-12">
                <div className="text-4xl mb-4">⏳</div>
                <p className="text-lg text-white">Loading upcoming tasks...</p>
              </div>
            ) : upcomingTasks.length > 0 ? (
              <>
                {upcomingTasks.map((task) => (
                  <Link href={`/task/${task.id}`} key={task.id}>
                    <Card className="hover:shadow-md transition-shadow border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
                      <CardContent className="p-0">
                        <div className="flex items-center">
                          {/* Emoji/Icon with colored background */}
                          <div
                            className={`w-14 h-14 flex items-center justify-center text-2xl ${getColorForDomain(task.domainName)}`}
                          >
                            {task.emoji}
                          </div>

                          {/* Task content */}
                          <div className="flex-1 py-3 px-4">
                            <h3 className="font-semibold text-base text-gray-900 mb-1">{task.title}</h3>
                            <div className="flex items-center gap-2">
                              <p className="text-sm text-gray-500">
                                {task.domainName} • {formatUpcomingDate(task.dueDate)}
                                {task.dueTime && ` at ${task.dueTime}`}
                              </p>
                              {selectedUserFilter === "all" && (
                                <>
                                  <span className="text-gray-300">•</span>
                                  <div className="flex items-center gap-1">
                                    <Avatar className="h-4 w-4">
                                      <AvatarFallback className="text-xs">{task.ownerAvatar}</AvatarFallback>
                                    </Avatar>
                                    <span className="text-sm text-gray-500">{task.ownerName}</span>
                                  </div>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Cute checkbox */}
                          <div 
                            className="pr-4"
                            onClick={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                          >
                            <CuteCheckbox 
                              checked={task.isCompleted} 
                              onChange={() => toggleUpcomingTask(task.id)} 
                            />
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📅</div>
                <h3 className="text-lg font-semibold text-white mb-2">No upcoming tasks</h3>
                <p className="text-white/80">
                  {selectedUserFilter === "all"
                    ? "No upcoming tasks for anyone."
                    : "No upcoming tasks for the selected person."}
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>

      {/* Floating Action Button for Add Task */}
      <Link href="/add-task">
        <div className="fixed bottom-20 mx-auto" style={{ maxWidth: "422px", right: "calc(50% - 211px + 10px)" }}>
          <Button
            size="lg"
            className="rounded-full shadow-2xl h-14 w-14 p-0 bg-gradient-to-br from-pink-500 to-red-500 hover:from-pink-600 hover:to-red-600 transition-colors border-2 border-white"
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

// Helper function to format upcoming dates nicely
function formatUpcomingDate(dateString?: string): string {
  if (!dateString) return "No date";
  
  const date = new Date(dateString);
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  
  // Reset time for comparison
  const taskDate = new Date(date.getFullYear(), date.getMonth(), date.getDate());
  const todayDate = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  const tomorrowDate = new Date(tomorrow.getFullYear(), tomorrow.getMonth(), tomorrow.getDate());
  
  if (taskDate.getTime() === todayDate.getTime()) {
    return "Today";
  } else if (taskDate.getTime() === tomorrowDate.getTime()) {
    return "Tomorrow";
  } else {
    const diffTime = taskDate.getTime() - todayDate.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 7) {
      return `In ${diffDays} day${diffDays === 1 ? '' : 's'}`;
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric',
        year: date.getFullYear() !== today.getFullYear() ? 'numeric' : undefined
      });
    }
  }
}
