// This is a placeholder for authentication logic
// Replace with your actual authentication implementation

import type { User } from "./types"

// Mock user data
const mockUsers = [
  {
    id: "1",
    name: "Demo User",
    email: "demo@example.com",
    password: "password123", // In a real app, never store plain text passwords
    avatarUrl: "/placeholder.svg?height=40&width=40",
  },
]

export type AuthState = {
  user: User | null
  isAuthenticated: boolean
  isLoading: boolean
}

export async function loginWithEmail(email: string, password: string): Promise<User> {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  const user = mockUsers.find((u) => u.email === email && u.password === password)

  if (!user) {
    throw new Error("Invalid email or password")
  }

  // In a real app, you would set cookies, tokens, etc.
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    avatarUrl: user.avatarUrl,
  }
}

export async function loginWithGoogle(): Promise<User> {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // In a real app, this would handle OAuth flow
  return {
    id: "google-123",
    name: "Google User",
    email: "google-user@example.com",
    avatarUrl: "/placeholder.svg?height=40&width=40",
  }
}

export async function signup(name: string, email: string, password: string): Promise<User> {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 1000))

  // Check if user already exists
  if (mockUsers.some((u) => u.email === email)) {
    throw new Error("User with this email already exists")
  }

  // In a real app, you would create the user in your database
  const newUser = {
    id: `user-${Date.now()}`,
    name,
    email,
    password, // In a real app, hash this password
    avatarUrl: "/placeholder.svg?height=40&width=40",
  }

  // In a real app, you would set cookies, tokens, etc.
  return {
    id: newUser.id,
    name: newUser.name,
    email: newUser.email,
    avatarUrl: newUser.avatarUrl,
  }
}

export async function logout(): Promise<void> {
  // Simulate API request delay
  await new Promise((resolve) => setTimeout(resolve, 500))

  // In a real app, you would clear cookies, tokens, etc.
}
