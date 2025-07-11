import { type NextRequest, NextResponse } from "next/server"
import { readDatabase, writeDatabase } from "@/lib/db"

export async function POST(request: NextRequest) {
  try {
    // Check if VAPID keys are configured
    const vapidPublicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY

    if (!vapidPublicKey) {
      return NextResponse.json({
        success: false,
        message: "VAPID public key not configured. Please set NEXT_PUBLIC_VAPID_PUBLIC_KEY environment variable.",
      })
    }

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
