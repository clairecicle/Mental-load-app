"use client"

import { useState, useEffect } from "react"

export interface ShoppingItem {
  id: string
  item_name: string
  quantity?: string
  notes?: string
  household_id: string
  created_by_id: string
  created_by_name: string
  is_purchased: number
  purchased_by_id?: string
  purchased_by_name?: string
  purchased_at?: string
  created_at: string
  updated_at: string
}

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true)
        const response = await fetch("/api/shopping")

        if (!response.ok) {
          throw new Error("Failed to fetch shopping items")
        }

        const data = await response.json()

        if (data.success) {
          setItems(data.items)
        } else {
          throw new Error(data.message || "Failed to fetch shopping items")
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "An unknown error occurred")
        console.error("Error fetching shopping items:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const toggleItemPurchased = async (itemId: string, isPurchased: boolean, userId: string) => {
    try {
      const response = await fetch(`/api/shopping/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          is_purchased: isPurchased ? 1 : 0,
          purchased_by_id: isPurchased ? userId : null,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update shopping item")
      }

      const data = await response.json()

      if (data.success) {
        // Update the items state
        setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? data.item : item)))
        return true
      } else {
        throw new Error(data.message || "Failed to update shopping item")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error updating shopping item:", err)
      return false
    }
  }

  const addItem = async (itemData: Partial<ShoppingItem>) => {
    try {
      const response = await fetch("/api/shopping", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(itemData),
      })

      if (!response.ok) {
        throw new Error("Failed to add shopping item")
      }

      const data = await response.json()

      if (data.success) {
        // Add the new item to the items state
        setItems((prevItems) => [data.item, ...prevItems])
        return data.item
      } else {
        throw new Error(data.message || "Failed to add shopping item")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error adding shopping item:", err)
      return null
    }
  }

  const removeItem = async (itemId: string) => {
    try {
      const response = await fetch(`/api/shopping/${itemId}`, {
        method: "DELETE",
      })

      if (!response.ok) {
        throw new Error("Failed to remove shopping item")
      }

      const data = await response.json()

      if (data.success) {
        // Remove the item from the items state
        setItems((prevItems) => prevItems.filter((item) => item.id !== itemId))
        return true
      } else {
        throw new Error(data.message || "Failed to remove shopping item")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error removing shopping item:", err)
      return false
    }
  }

  const updateItemCategory = async (itemId: string, category: string) => {
    try {
      const response = await fetch(`/api/shopping/${itemId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          category: category,
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to update item category")
      }

      const data = await response.json()

      if (data.success) {
        // Update the items state
        setItems((prevItems) => prevItems.map((item) => (item.id === itemId ? data.item : item)))
        return true
      } else {
        throw new Error(data.message || "Failed to update item category")
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "An unknown error occurred")
      console.error("Error updating item category:", err)
      return false
    }
  }

  return { items, loading, error, toggleItemPurchased, addItem, removeItem, updateItemCategory }
}
