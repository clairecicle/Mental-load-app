"use client"

import { useState, useEffect } from "react"

export interface Discussion {
  id: string
  title: string
  details?: string
  household_id: string
  created_by_id: string
  created_by_name: string
  links?: string[]
  screenshots?: string[]
  is_resolved: number
  resolved_at?: string
  created_at: string
  updated_at: string
}

export function useDiscussions() {
  const [discussions, setDiscussions] = useState<Discussion[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDiscussions() {
      try {
        setLoading(true)
        const response = await fetch("/api/discussions")

        if (!response.ok) {
          throw new Error("Failed to fetch discussions")
        }

        const data = await response.json()

        if (data.success) {
          // Parse JSON strings for links and screenshots
          const parsedDiscussions = data.discussions.map((discussion: any) => ({
            ...discussion,
            links: discussion.links ? JSON.parse(discussion.links) : [],
            screenshots: discussion.screenshots ? JSON.parse(discussion.screenshots) : [],
          }))

          setDiscussions(parsedDiscussions)
        } else {
          throw new Error(data.message || "Failed to fetch discussions")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching discussions:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDiscussions()
  }, [])

  const createDiscussion = async (discussionData: Partial<Discussion>) => {
    try {
      const response = await fetch("/api/discussions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(discussionData),
      })

      if (!response.ok) {
        throw new Error("Failed to create discussion")
      }

      const data = await response.json()

      if (data.success) {
        // Add the new discussion to the discussions state
        setDiscussions((prevDiscussions) => [data.discussion, ...prevDiscussions])
        return data.discussion
      } else {
        throw new Error(data.message || "Failed to create discussion")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error creating discussion:", err)
      return null
    }
  }

  return { discussions, loading, error, createDiscussion }
}
