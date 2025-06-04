"use client"

import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"

interface UserFilterProps {
  selectedFilter: string
  onFilterChange: (filter: string) => void
}

export function UserFilter({ selectedFilter, onFilterChange }: UserFilterProps) {
  const filterOptions = [
    {
      id: "alice",
      label: "My Tasks",
      avatar: "AJ",
      name: "Alice",
    },
    {
      id: "bob",
      label: "Bob's Tasks",
      avatar: "BS",
      name: "Bob",
    },
    {
      id: "all",
      label: "All Tasks",
      avatar: null,
      name: "Household",
    },
  ]

  return (
    <div className="flex gap-2 px-1">
      {filterOptions.map((option) => (
        <Button
          key={option.id}
          variant={selectedFilter === option.id ? "default" : "outline"}
          size="sm"
          onClick={() => onFilterChange(option.id)}
          className={`flex items-center gap-2 rounded-full transition-all ${
            selectedFilter === option.id
              ? "bg-white/90 text-gray-900 backdrop-blur-sm shadow-sm"
              : "bg-white/20 text-white border-white/30 hover:bg-white/30 backdrop-blur-sm"
          }`}
        >
          {option.avatar ? (
            <Avatar className="h-5 w-5">
              <AvatarFallback className="text-xs">{option.avatar}</AvatarFallback>
            </Avatar>
          ) : (
            <div className="h-5 w-5 rounded-full bg-white/20 flex items-center justify-center">
              <span className="text-xs text-white">👥</span>
            </div>
          )}
          <span className="text-sm font-medium">{option.label}</span>
        </Button>
      ))}
    </div>
  )
}
