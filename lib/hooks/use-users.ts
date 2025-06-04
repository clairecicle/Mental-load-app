"use client"

import { useState, useEffect } from "react"

export interface User {
  id: string
  name: string
  email: string
  created_at: string
  updated_at: string
}

export function useUsers() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true)
        const response = await fetch("/api/users")

        if (!response.ok) {
          throw new Error("Failed to fetch users")
        }

        const data = await response.json()

        if (data.success) {
          setUsers(data.users)
        } else {
          throw new Error(data.message || "Failed to fetch users")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching users:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchUsers()
  }, [])

  return { users, loading, error }
}
