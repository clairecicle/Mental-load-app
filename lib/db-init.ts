import fs from "fs/promises"
import path from "path"

// Sample data structure
const sampleData = {
  users: [
    {
      id: "550e8400-e29b-41d4-a716-446655440001",
      email: "alice@example.com",
      name: "Alice Johnson",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440002",
      email: "bob@example.com",
      name: "Bob Smith",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  households: [
    {
      id: "550e8400-e29b-41d4-a716-446655440010",
      name: "The Johnson-Smith Family",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  user_households: [
    {
      id: "550e8400-e29b-41d4-a716-446655440101",
      user_id: "550e8400-e29b-41d4-a716-446655440001",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      role: "admin",
      joined_at: new Date().toISOString(),
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440102",
      user_id: "550e8400-e29b-41d4-a716-446655440002",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      role: "member",
      joined_at: new Date().toISOString(),
    },
  ],
  domains: [
    {
      id: "550e8400-e29b-41d4-a716-446655440020",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      owner_id: "550e8400-e29b-41d4-a716-446655440001",
      name: "Kitchen Management",
      details: "All tasks related to kitchen cleaning and maintenance",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440021",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      owner_id: "550e8400-e29b-41d4-a716-446655440002",
      name: "Pet Care",
      details: "Taking care of our dog Max",
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  tasks: [
    {
      id: "550e8400-e29b-41d4-a716-446655440030",
      domain_id: "550e8400-e29b-41d4-a716-446655440020",
      owner_id: "550e8400-e29b-41d4-a716-446655440001",
      title: "Clean refrigerator",
      details: "Deep clean shelves and drawers",
      due_date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      frequency_type: "weekly",
      frequency_interval: 1,
      is_completed: false,
      is_snoozed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440031",
      domain_id: "550e8400-e29b-41d4-a716-446655440021",
      owner_id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Walk Max",
      details: "Morning walk around the neighborhood",
      due_date: new Date().toISOString().split("T")[0],
      frequency_type: "daily",
      frequency_interval: 1,
      is_completed: false,
      is_snoozed: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  discussion_items: [
    {
      id: "550e8400-e29b-41d4-a716-446655440050",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      created_by_id: "550e8400-e29b-41d4-a716-446655440002",
      title: "Should we get a robot vacuum?",
      details: "I saw a good deal on a Roomba. What do you think?",
      is_resolved: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
  shopping_list_items: [
    {
      id: "550e8400-e29b-41d4-a716-446655440060",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      created_by_id: "550e8400-e29b-41d4-a716-446655440001",
      item_name: "Milk",
      quantity: "1 gallon",
      is_purchased: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
    {
      id: "550e8400-e29b-41d4-a716-446655440061",
      household_id: "550e8400-e29b-41d4-a716-446655440010",
      created_by_id: "550e8400-e29b-41d4-a716-446655440002",
      item_name: "Dog food",
      quantity: "1 bag",
      is_purchased: false,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    },
  ],
}

// Database file path
const dbPath = path.join(process.cwd(), ".data", "db.json")

// Initialize the database
export async function initializeDatabase() {
  console.log("Initializing JSON database...")

  // Ensure data directory exists
  const dataDir = path.dirname(dbPath)
  try {
    await fs.access(dataDir)
  } catch {
    await fs.mkdir(dataDir, { recursive: true })
  }

  // Check if database file exists
  try {
    await fs.access(dbPath)
    console.log("Database file already exists")

    // Check if it has data
    const data = await fs.readFile(dbPath, "utf-8")
    const db = JSON.parse(data)
    if (db.users && db.users.length > 0) {
      console.log("Database already has data")
      return
    }
  } catch {
    // File doesn't exist, create it
  }

  // Write sample data
  await fs.writeFile(dbPath, JSON.stringify(sampleData, null, 2))
  console.log("Sample data inserted into JSON database")
  console.log("Database initialization complete")
}

// Function to generate a UUID
export function generateUUID(): string {
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0
    const v = c === "x" ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}
