import { NextResponse } from "next/server"
import { readDatabase, writeDatabase } from "@/lib/db"

export async function GET() {
  try {
    // Check if VAPID keys are configured
    const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
    const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY

    if (!vapidPublicKey || !vapidPrivateKey) {
      return NextResponse.json({
        success: false,
        message: "VAPID keys not configured. Please set VAPID_PUBLIC_KEY and VAPID_PRIVATE_KEY environment variables.",
      })
    }

    // Dynamically import web-push only when needed
    const webpush = (await import("web-push")).default

    // Configure web-push
    webpush.setVapidDetails("mailto:your-email@example.com", vapidPublicKey, vapidPrivateKey)

    const db = readDatabase()
    const now = new Date()

    // Find tasks that are due now (within the last 5 minutes)
    const dueTasks = (db.tasks || []).filter((task: any) => {
      if (!task.due_date || task.notification_sent) return false

      const dueDate = new Date(task.due_date)
      const timeDiff = now.getTime() - dueDate.getTime()

      // Task is due if it's within the last 5 minutes
      return timeDiff >= 0 && timeDiff <= 5 * 60 * 1000
    })

    // Send notifications for due tasks
    const notifications = []
    for (const task of dueTasks) {
      // Send to all subscribed users (in a real app, you'd filter by task owner)
      const subscriptions = db.push_subscriptions || []

      for (const sub of subscriptions) {
        try {
          await webpush.sendNotification(
            sub.subscription,
            JSON.stringify({
              title: "Task Due!",
              body: task.title,
              primaryKey: task.id,
            }),
          )
          notifications.push({ taskId: task.id, sent: true })
        } catch (error) {
          console.error("Failed to send notification:", error)
          notifications.push({ taskId: task.id, sent: false, error: error.message })
        }
      }

      // Mark task as notification sent
      task.notification_sent = true
    }

    // Update database with notification flags
    if (dueTasks.length > 0) {
      const updatedDb = { ...db }
      writeDatabase(updatedDb)
    }

    return NextResponse.json({
      success: true,
      checkedTasks: dueTasks.length,
      notifications: notifications,
    })
  } catch (error) {
    console.error("Error checking due tasks:", error)
    return NextResponse.json({ error: "Failed to check due tasks" }, { status: 500 })
  }
}
