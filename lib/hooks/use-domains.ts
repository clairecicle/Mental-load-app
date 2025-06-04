"use client"

import { useState, useEffect } from "react"

export interface Domain {
  id: string
  name: string
  details?: string
  household_id: string
  owner_id: string
  owner_name: string
  links?: string[]
  screenshots?: string[]
  created_at: string
  updated_at: string
}

export function useDomains() {
  const [domains, setDomains] = useState<Domain[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchDomains() {
      try {
        setLoading(true)
        const response = await fetch("/api/domains")

        if (!response.ok) {
          throw new Error("Failed to fetch domains")
        }

        const data = await response.json()

        if (data.success) {
          // Parse JSON strings for links and screenshots
          const parsedDomains = data.domains.map((domain: any) => ({
            ...domain,
            links: domain.links ? JSON.parse(domain.links) : [],
            screenshots: domain.screenshots ? JSON.parse(domain.screenshots) : [],
          }))

          setDomains(parsedDomains)
        } else {
          throw new Error(data.message || "Failed to fetch domains")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching domains:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchDomains()
  }, [])

  const createDomain = async (domainData: Partial<Domain>) => {
    try {
      const response = await fetch("/api/domains", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(domainData),
      })

      if (!response.ok) {
        throw new Error("Failed to create domain")
      }

      const data = await response.json()

      if (data.success) {
        // Add the new domain to the domains state
        setDomains((prevDomains) => [data.domain, ...prevDomains])
        return data.domain
      } else {
        throw new Error(data.message || "Failed to create domain")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error creating domain:", err)
      return null
    }
  }

  return { domains, loading, error, createDomain }
}
