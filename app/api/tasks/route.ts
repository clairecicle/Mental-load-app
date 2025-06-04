import { NextResponse } from "next/server"
import { query, execute, queryOne } from "@/lib/db"
import { generateUUID } from "@/lib/db-init"

export async function GET() {
  try {
    const tasks = await query(`
      SELECT t.*, u.name as owner_name, d.name as domain_name
      FROM tasks t
      JOIN users u ON t.owner_id = u.id
      JOIN domains d ON t.domain_id = d.id
      ORDER BY t.due_date ASC
    `)

    return NextResponse.json({ success: true, tasks })
  } catch (error) {
    console.error("Failed to fetch tasks:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch tasks", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, details, domain_id, owner_id, due_date, due_time, frequency_type, frequency_interval } = body

    if (!title || !domain_id || !owner_id) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const id = generateUUID()

    await execute(
      `INSERT INTO tasks (
        id, title, details, domain_id, owner_id, due_date, due_time, 
        frequency_type, frequency_interval
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, title, details, domain_id, owner_id, due_date, due_time, frequency_type, frequency_interval],
    )

    const newTask = await queryOne(
      `
      SELECT t.*, u.name as owner_name, d.name as domain_name
      FROM tasks t
      JOIN users u ON t.owner_id = u.id
      JOIN domains d ON t.domain_id = d.id
      WHERE t.id = ?
    `,
      [id],
    )

    return NextResponse.json({ success: true, task: newTask })
  } catch (error) {
    console.error("Failed to create task:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create task", error: String(error) },
      { status: 500 },
    )
  }
}
