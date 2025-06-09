export interface User {
  id: string
  name: string
  email: string
  avatarUrl?: string
}

export interface Task {
  id: string
  title: string
  description?: string
  dueDate?: string
  completed: boolean
  ownerId: string
  domainId: string
  createdAt: string
  updatedAt: string
  priority?: "low" | "medium" | "high"
  recurring?: boolean
  recurringPattern?: string
}

export interface Domain {
  id: string
  name: string
  description?: string
  color: string
  icon?: string
  ownerId: string
  createdAt: string
  updatedAt: string
}

export interface Discussion {
  id: string
  title: string
  description: string
  createdAt: string
  updatedAt: string
  ownerId: string
  resolved: boolean
}

export interface ShoppingItem {
  id: string
  name: string
  quantity: number
  completed: boolean
  addedBy: string
  createdAt: string
}

export interface NotificationPreference {
  userId: string
  taskReminders: boolean
  discussionAlerts: boolean
  shoppingListUpdates: boolean
  pushEnabled: boolean
}
