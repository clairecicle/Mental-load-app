import fs from "fs/promises"
import path from "path"

// Types for our data structure
export interface User {
  id: string
  email: string
  name: string
  created_at: string
  updated_at: string
}

export interface Household {
  id: string
  name: string
  created_at: string
  updated_at: string
}

export interface Domain {
  id: string
  household_id: string
  owner_id: string
  name: string
  details?: string
  links?: string[]
  screenshots?: string[]
  created_at: string
  updated_at: string
}

export interface Task {
  id: string
  domain_id: string
  owner_id: string
  title: string
  details?: string
  links?: string[]
  screenshots?: string[]
  due_date?: string
  due_time?: string
  frequency_type?: string
  frequency_interval?: number
  is_completed: boolean
  completed_at?: string
  is_snoozed: boolean
  snoozed_until?: string
  created_at: string
  updated_at: string
}

export interface DiscussionItem {
  id: string
  household_id: string
  created_by_id: string
  title: string
  details?: string
  links?: string[]
  screenshots?: string[]
  is_resolved: boolean
  resolved_at?: string
  created_at: string
  updated_at: string
}

export interface ShoppingListItem {
  id: string
  household_id: string
  created_by_id: string
  item_name: string
  quantity?: string
  notes?: string
  is_purchased: boolean
  purchased_by_id?: string
  purchased_at?: string
  created_at: string
  updated_at: string
}

interface Database {
  users: User[]
  households: Household[]
  user_households: Array<{
    id: string
    user_id: string
    household_id: string
    role: string
    joined_at: string
  }>
  domains: Domain[]
  tasks: Task[]
  discussion_items: DiscussionItem[]
  shopping_list_items: ShoppingListItem[]
}

// Database file path
const dbPath = path.join(process.cwd(), ".data", "db.json")

// Ensure data directory exists
async function ensureDataDir() {
  const dataDir = path.dirname(dbPath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }
}

// Read database
async function readDb(): Promise<Database> {
  try {
    await ensureDataDir()
    const data = await fs.readFile(dbPath, "utf-8")
    return JSON.parse(data)
  } catch {
    // Return empty database if file doesn't exist
    return {
      users: [],
      households: [],
      user_households: [],
      domains: [],
      tasks: [],
      discussion_items: [],
      shopping_list_items: [],
    }
  }
}

// Write database
async function writeDb(db: Database): Promise<void> {
  await ensureDataDir()
  await fs.writeFile(dbPath, JSON.stringify(db, null, 2))
}

// Export the read and write functions with the expected names
export const readDatabase = readDb
export const writeDatabase = writeDb

// Helper functions
export async function query<T = any>(sql: string, params: any[] = []): Promise<T[]> {
  const db = await readDb()

  // Simple SQL parsing for basic operations
  if (sql.includes("SELECT") && sql.includes("FROM tasks")) {
    if (sql.includes("JOIN users") && sql.includes("JOIN domains")) {
      // Tasks with user and domain info
      return db.tasks.map((task) => {
        const user = db.users.find((u) => u.id === task.owner_id)
        const domain = db.domains.find((d) => d.id === task.domain_id)
        return {
          ...task,
          owner_name: user?.name,
          domain_name: domain?.name,
        }
      }) as T[]
    }
    return db.tasks as T[]
  }

  if (sql.includes("SELECT") && sql.includes("FROM users")) {
    return db.users as T[]
  }

  if (sql.includes("SELECT") && sql.includes("FROM domains")) {
    if (sql.includes("JOIN users")) {
      return db.domains.map((domain) => {
        const user = db.users.find((u) => u.id === domain.owner_id)
        return {
          ...domain,
          owner_name: user?.name,
        }
      }) as T[]
    }
    return db.domains as T[]
  }

  if (sql.includes("SELECT") && sql.includes("FROM discussion_items")) {
    if (sql.includes("JOIN users")) {
      return db.discussion_items.map((item) => {
        const user = db.users.find((u) => u.id === item.created_by_id)
        return {
          ...item,
          created_by_name: user?.name,
        }
      }) as T[]
    }
    return db.discussion_items as T[]
  }

  if (sql.includes("SELECT") && sql.includes("FROM shopping_list_items")) {
    if (sql.includes("JOIN users")) {
      return db.shopping_list_items.map((item) => {
        const createdBy = db.users.find((u) => u.id === item.created_by_id)
        const purchasedBy = item.purchased_by_id ? db.users.find((u) => u.id === item.purchased_by_id) : null
        return {
          ...item,
          created_by_name: createdBy?.name,
          purchased_by_name: purchasedBy?.name,
        }
      }) as T[]
    }
    return db.shopping_list_items as T[]
  }

  return []
}

export async function queryOne<T = any>(sql: string, params: any[] = []): Promise<T | undefined> {
  const results = await query<T>(sql, params)
  return results[0]
}

export async function execute(sql: string, params: any[] = []): Promise<number> {
  const db = await readDb()

  if (sql.includes("INSERT INTO tasks")) {
    const [id, domain_id, owner_id, title, details, due_date, frequency_type, frequency_interval] = params
    const newTask: Task = {
      id,
      domain_id,
      owner_id,
      title,
      details,
      due_date,
      frequency_type,
      frequency_interval: frequency_interval || 1,
      is_completed: false,
      is_snoozed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.tasks.push(newTask)
    await writeDb(db)
    return 1
  }

  if (sql.includes("INSERT INTO domains")) {
    const [id, household_id, owner_id, name, details] = params
    const newDomain: Domain = {
      id,
      household_id,
      owner_id,
      name,
      details,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.domains.push(newDomain)
    await writeDb(db)
    return 1
  }

  if (sql.includes("INSERT INTO discussion_items")) {
    const [id, title, details, household_id, created_by_id, links, screenshots] = params
    const newItem: DiscussionItem = {
      id,
      household_id,
      created_by_id,
      title,
      details,
      links: links ? JSON.parse(links) : undefined,
      screenshots: screenshots ? JSON.parse(screenshots) : undefined,
      is_resolved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.discussion_items.push(newItem)
    await writeDb(db)
    return 1
  }

  if (sql.includes("INSERT INTO shopping_list_items")) {
    const [id, household_id, created_by_id, item_name, quantity, notes] = params
    const newItem: ShoppingListItem = {
      id,
      household_id,
      created_by_id,
      item_name,
      quantity,
      notes,
      is_purchased: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }
    db.shopping_list_items.push(newItem)
    await writeDb(db)
    return 1
  }

  if (sql.includes("UPDATE tasks") && sql.includes("SET is_completed")) {
    const taskId = params[params.length - 1] // Last param is usually the ID
    const taskIndex = db.tasks.findIndex((t) => t.id === taskId)
    if (taskIndex !== -1) {
      db.tasks[taskIndex].is_completed = params[0] === 1
      db.tasks[taskIndex].completed_at = params[0] === 1 ? new Date().toISOString() : undefined
      db.tasks[taskIndex].updated_at = new Date().toISOString()
      await writeDb(db)
      return 1
    }
  }

  if (sql.includes("UPDATE shopping_list_items") && sql.includes("SET is_purchased")) {
    const itemId = params[params.length - 1]
    const itemIndex = db.shopping_list_items.findIndex((i) => i.id === itemId)
    if (itemIndex !== -1) {
      db.shopping_list_items[itemIndex].is_purchased = params[0] === 1
      db.shopping_list_items[itemIndex].purchased_at = params[0] === 1 ? new Date().toISOString() : undefined
      db.shopping_list_items[itemIndex].purchased_by_id = params[1] || undefined
      db.shopping_list_items[itemIndex].updated_at = new Date().toISOString()
      await writeDb(db)
      return 1
    }
  }

  if (sql.includes("DELETE FROM shopping_list_items")) {
    const itemId = params[0]
    const initialLength = db.shopping_list_items.length
    db.shopping_list_items = db.shopping_list_items.filter((i) => i.id !== itemId)
    if (db.shopping_list_items.length < initialLength) {
      await writeDb(db)
      return 1
    }
  }

  return 0
}

export async function tableExists(tableName: string): Promise<boolean> {
  // Always return true since we're using JSON structure
  return true
}
