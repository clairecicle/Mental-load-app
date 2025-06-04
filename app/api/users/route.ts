import { NextResponse } from "next/server"
import { query, execute } from "@/lib/db"
import { generateUUID } from "@/lib/db-init"

export async function GET() {
  try {
    const users = await query("SELECT * FROM users")
    return NextResponse.json({ success: true, users })
  } catch (error) {
    console.error("Failed to fetch users:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch users", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, email } = body

    if (!name || !email) {
      return NextResponse.json({ success: false, message: "Name and email are required" }, { status: 400 })
    }

    const id = generateUUID()

    await execute("INSERT INTO users (id, name, email) VALUES (?, ?, ?)", [id, name, email])

    const newUser = await query("SELECT * FROM users WHERE id = ?", [id])

    return NextResponse.json({ success: true, user: newUser[0] })
  } catch (error) {
    console.error("Failed to create user:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create user", error: String(error) },
      { status: 500 },
    )
  }
}
