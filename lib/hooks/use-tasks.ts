"use client"

import { useState, useEffect } from "react"

export interface Task {
  id: string
  title: string
  details?: string
  domain_id: string
  domain_name: string
  owner_id: string
  owner_name: string
  due_date?: string
  due_time?: string
  frequency_type?: string
  frequency_interval?: number
  is_completed: number
  completed_at?: string
  is_snoozed: number
  snoozed_until?: string
  created_at: string
  updated_at: string
  subtasks?: Subtask[]
}

export interface Subtask {
  id: string
  parent_task_id: string
  title: string
  details?: string
  owner_id: string
  owner_name: string
  is_completed: number
  due_date?: string
  due_time?: string
}

export function useTasks(userId?: string) {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchTasks() {
      try {
        setLoading(true)
        const response = await fetch("/api/tasks")

        if (!response.ok) {
          throw new Error("Failed to fetch tasks")
        }

        const data = await response.json()

        if (data.success) {
          let filteredTasks = data.tasks

          // Filter by user if userId is provided
          if (userId) {
            filteredTasks = filteredTasks.filter((task: Task) => task.owner_id === userId)
          }

          setTasks(filteredTasks)
        } else {
          throw new Error(data.message || "Failed to fetch tasks")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching tasks:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchTasks()
  }, [userId])

  const toggleTaskCompletion = async (taskId: string, isCompleted: boolean) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_completed: isCompleted ? 1 : 0,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update task")
      }

      const data = await response.json()

      if (data.success) {
        // Update the tasks state
        setTasks((prevTasks) =>
          prevTasks.map((task) => (task.id === taskId ? { ...task, is_completed: isCompleted ? 1 : 0 } : task)),
        )
        return true
      } else {
        throw new Error(data.message || "Failed to update task")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error updating task:", err)
      return false
    }
  }

  const createTask = async (taskData: Partial<Task>) => {
    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(taskData),
      })

      if (!response.ok) {
        throw new Error("Failed to create task")
      }

      const data = await response.json()

      if (data.success) {
        // Add the new task to the tasks state
        setTasks((prevTasks) => [data.task, ...prevTasks])
        return data.task
      } else {
        throw new Error(data.message || "Failed to create task")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error creating task:", err)
      return null
    }
  }

  return { tasks, loading, error, toggleTaskCompletion, createTask }
}
