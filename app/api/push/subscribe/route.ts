import { type NextRequest, NextResponse } from "next/server"
import { readDatabase, writeDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    const subscription = await request.json()

    // Read current database
    const db = readDatabase()

    // Initialize push_subscriptions if it doesn't exist
    if (!db.push_subscriptions) {
      db.push_subscriptions = []
    }

    // Add new subscription (in a real app, you'd associate this with a user)
    db.push_subscriptions.push({
      id: Date.now().toString(),
      subscription: subscription,
      created_at: new Date().toISOString(),
    })

    // Write back to database
    writeDatabase(db)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error saving push subscription:", error)
    return NextResponse.json({ error: "Failed to save subscription" }, { status: 500 })
  }
}
