"use client"

import { useState, useMemo } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { ShoppingCart, Plus, Trash2 } from "lucide-react"
import { CuteCheckbox } from "@/components/cute-checkbox"

interface ShoppingItem {
  id: string
  name: string
  quantity: string
  addedBy: string
  addedByAvatar: string
  isPurchased: boolean
  category: string
  emoji: string
}

export function ShoppingList() {
  const [items, setItems] = useState<ShoppingItem[]>([
    {
      id: "1",
      name: "Milk",
      quantity: "1 gallon",
      addedBy: "Alice",
      addedByAvatar: "AJ",
      isPurchased: false,
      category: "Dairy",
      emoji: "🥛",
    },
    {
      id: "2",
      name: "Dog food",
      quantity: "1 bag",
      addedBy: "Bob",
      addedByAvatar: "BS",
      isPurchased: false,
      category: "Pet Supplies",
      emoji: "🐕",
    },
    {
      id: "3",
      name: "Bread",
      quantity: "2 loaves",
      addedBy: "Alice",
      addedByAvatar: "AJ",
      isPurchased: true,
      category: "Bakery",
      emoji: "🍞",
    },
    {
      id: "4",
      name: "Cleaning supplies",
      quantity: "Multi-surface cleaner",
      addedBy: "Bob",
      addedByAvatar: "BS",
      isPurchased: false,
      category: "Household",
      emoji: "🧹",
    },
    {
      id: "5",
      name: "Apples",
      quantity: "6 medium",
      addedBy: "Alice",
      addedByAvatar: "AJ",
      isPurchased: false,
      category: "Produce",
      emoji: "🍎",
    },
    {
      id: "6",
      name: "Pasta",
      quantity: "2 boxes",
      addedBy: "Bob",
      addedByAvatar: "BS",
      isPurchased: false,
      category: "Pantry",
      emoji: "🍝",
    },
    {
      id: "7",
      name: "Yogurt",
      quantity: "32 oz container",
      addedBy: "Alice",
      addedByAvatar: "AJ",
      isPurchased: false,
      category: "Dairy",
      emoji: "🥛",
    },
    {
      id: "8",
      name: "Bananas",
      quantity: "1 bunch",
      addedBy: "Bob",
      addedByAvatar: "BS",
      isPurchased: false,
      category: "Produce",
      emoji: "🍌",
    },
    {
      id: "9",
      name: "Cat treats",
      quantity: "1 bag",
      addedBy: "Alice",
      addedByAvatar: "AJ",
      isPurchased: false,
      category: "Pet Supplies",
      emoji: "🐱",
    },
  ])

  const [newItem, setNewItem] = useState("")

  const togglePurchased = (id: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, isPurchased: !item.isPurchased } : item)))
  }

  const addItem = () => {
    if (newItem.trim()) {
      // Simple auto-categorization based on keywords
      let category = "Other"
      let emoji = "🛒"

      const itemLower = newItem.toLowerCase()
      if (itemLower.includes("milk") || itemLower.includes("cheese") || itemLower.includes("yogurt")) {
        category = "Dairy"
        emoji = "🥛"
      } else if (itemLower.includes("apple") || itemLower.includes("banana") || itemLower.includes("vegetable")) {
        category = "Produce"
        emoji = "🍎"
      } else if (itemLower.includes("dog") || itemLower.includes("cat") || itemLower.includes("pet")) {
        category = "Pet Supplies"
        emoji = "🐕"
      } else if (itemLower.includes("bread") || itemLower.includes("bagel") || itemLower.includes("muffin")) {
        category = "Bakery"
        emoji = "🍞"
      } else if (itemLower.includes("pasta") || itemLower.includes("rice") || itemLower.includes("cereal")) {
        category = "Pantry"
        emoji = "🍝"
      } else if (itemLower.includes("clean") || itemLower.includes("soap") || itemLower.includes("detergent")) {
        category = "Household"
        emoji = "🧹"
      }

      const newItemObj = {
        id: Date.now().toString(),
        name: newItem,
        quantity: "",
        addedBy: "Alice", // In real app, this would be current user
        addedByAvatar: "AJ",
        isPurchased: false,
        category,
        emoji,
      }
      setItems((prev) => [...prev, newItemObj])
      setNewItem("")
    }
  }

  const removeItem = (id: string) => {
    setItems((prev) => prev.filter((item) => item.id !== id))
  }

  // Group items by category
  const groupedItems = useMemo(() => {
    const unpurchasedItems = items.filter((item) => !item.isPurchased)
    const purchasedItems = items.filter((item) => item.isPurchased)

    // Group unpurchased items by category
    const grouped: Record<string, ShoppingItem[]> = {}

    unpurchasedItems.forEach((item) => {
      if (!grouped[item.category]) {
        grouped[item.category] = []
      }
      grouped[item.category].push(item)
    })

    // Sort categories alphabetically
    const sortedCategories = Object.keys(grouped).sort()

    return {
      categories: sortedCategories.map((category) => ({
        name: category,
        items: grouped[category],
      })),
      purchasedItems,
    }
  }, [items])

  const getCategoryColor = (category: string): string => {
    const categoryColors: Record<string, string> = {
      Dairy: "bg-blue-100",
      "Pet Supplies": "bg-purple-100",
      Bakery: "bg-yellow-100",
      Household: "bg-green-100",
      Produce: "bg-emerald-100",
      Pantry: "bg-orange-100",
      Meat: "bg-red-100",
      Frozen: "bg-cyan-100",
      Snacks: "bg-pink-100",
      Beverages: "bg-indigo-100",
      Other: "bg-gray-100",
    }
    return categoryColors[category] || "bg-gray-100"
  }

  const getCategoryEmoji = (category: string): string => {
    const categoryEmojis: Record<string, string> = {
      Dairy: "🥛",
      "Pet Supplies": "🐕",
      Bakery: "🍞",
      Household: "🧹",
      Produce: "🍎",
      Pantry: "🍝",
      Meat: "🥩",
      Frozen: "❄️",
      Snacks: "🍪",
      Beverages: "🥤",
      Other: "🛒",
    }
    return categoryEmojis[category] || "🛒"
  }

  const renderShoppingItem = (item: ShoppingItem) => (
    <Card
      key={item.id}
      className={`border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden ${item.isPurchased ? "opacity-60" : ""}`}
    >
      <CardContent className="p-0">
        <div className="flex items-center">
          <div className={`w-14 h-14 flex items-center justify-center text-2xl ${getCategoryColor(item.category)}`}>
            {item.emoji}
          </div>
          <div className="flex-1 py-3 px-4">
            <div className="flex items-center justify-between mb-1">
              <h3 className={`font-semibold ${item.isPurchased ? "text-gray-500 line-through" : "text-gray-900"}`}>
                {item.name}
              </h3>
              <Badge variant="outline" className="rounded-full text-xs">
                {item.category}
              </Badge>
            </div>
            {item.quantity && (
              <p className={`text-sm ${item.isPurchased ? "text-gray-500 line-through" : "text-gray-600"} mb-1`}>
                {item.quantity}
              </p>
            )}
            <div className="flex items-center gap-2">
              <Avatar className="h-5 w-5">
                <AvatarFallback className="text-xs">{item.addedByAvatar}</AvatarFallback>
              </Avatar>
              <span className="text-xs text-gray-500">Added by {item.addedBy}</span>
            </div>
          </div>
          <div className="flex items-center gap-2 pr-4">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-gray-400 hover:text-red-600 rounded-full"
              onClick={() => removeItem(item.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
            <div onClick={(e) => e.stopPropagation()}>
              <CuteCheckbox checked={item.isPurchased} onChange={() => togglePurchased(item.id)} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-400 via-teal-500 to-cyan-600 font-['Nunito']">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-sm border-b border-white/20 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <ShoppingCart className="h-5 w-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-semibold text-white">Shopping List</h1>
              <p className="text-sm text-white/80">
                {items.filter((item) => !item.isPurchased).length} items remaining
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="p-4 space-y-4 pb-32">
        {/* Category Sections */}
        {groupedItems.categories.map((category) => (
          <div key={category.name} className="space-y-3">
            <div className="flex items-center gap-4 my-6">
              <div className={`w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center`}>
                <span className="text-lg">{getCategoryEmoji(category.name)}</span>
              </div>
              <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">{category.name}</h2>
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="text-sm text-white/80">{category.items.length}</span>
            </div>

            {category.items.map(renderShoppingItem)}
          </div>
        ))}

        {/* Purchased Items */}
        {groupedItems.purchasedItems.length > 0 && (
          <div className="space-y-3">
            <div className="flex items-center gap-4 my-6">
              <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center">
                <span className="text-white font-bold">✓</span>
              </div>
              <h2 className="text-sm font-semibold text-white/90 uppercase tracking-wider">Purchased</h2>
              <div className="flex-1 h-px bg-white/30"></div>
              <span className="text-sm text-white/80">{groupedItems.purchasedItems.length}</span>
            </div>

            {groupedItems.purchasedItems.map(renderShoppingItem)}
          </div>
        )}

        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛒</div>
            <h3 className="text-lg font-semibold text-white mb-2">Your shopping list is empty</h3>
            <p className="text-white/80">Add some items to get started!</p>
          </div>
        )}
      </div>

      {/* Add New Item - Sticky Floating */}
      <div className="sticky bottom-[60px] bg-white/10 backdrop-blur-sm border-t border-white/20 px-4 py-3">
        <Card className="border-0 shadow-xl bg-white/95 backdrop-blur-sm overflow-hidden">
          <CardContent className="p-0">
            <div className="flex items-center">
              <div className="w-14 h-14 flex items-center justify-center text-2xl bg-teal-100">🛍️</div>
              <div className="flex-1 p-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Add new item..."
                    value={newItem}
                    onChange={(e) => setNewItem(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addItem()}
                    className="flex-1 border-gray-200 rounded-xl"
                  />
                  <Button
                    onClick={addItem}
                    className="rounded-full bg-gradient-to-br from-teal-500 to-cyan-600 hover:from-teal-600 hover:to-cyan-700"
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
