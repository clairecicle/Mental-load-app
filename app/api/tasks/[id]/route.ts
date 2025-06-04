import { NextResponse } from "next/server"
import { query, execute, queryOne } from "@/lib/db"

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const task = await queryOne(
      `
      SELECT t.*, u.name as owner_name, d.name as domain_name
      FROM tasks t
      JOIN users u ON t.owner_id = u.id
      JOIN domains d ON t.domain_id = d.id
      WHERE t.id = ?
    `,
      [params.id],
    )

    if (!task) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 })
    }

    // Get subtasks if any
    const subtasks = await query(
      `
      SELECT s.*, u.name as owner_name
      FROM subtasks s
      JOIN users u ON s.owner_id = u.id
      WHERE s.parent_task_id = ?
    `,
      [params.id],
    )

    return NextResponse.json({
      success: true,
      task: {
        ...task,
        subtasks,
      },
    })
  } catch (error) {
    console.error(`Failed to fetch task ${params.id}:`, error)
    return NextResponse.json({ success: false, message: "Failed to fetch task", error: String(error) }, { status: 500 })
  }
}

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const {
      title,
      details,
      domain_id,
      owner_id,
      due_date,
      due_time,
      frequency_type,
      frequency_interval,
      is_completed,
    } = body

    // Check if task exists
    const existingTask = await queryOne("SELECT * FROM tasks WHERE id = ?", [params.id])
    if (!existingTask) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 })
    }

    // Update task
    const completedAt = is_completed ? "datetime('now')" : null

    await execute(
      `UPDATE tasks SET
        title = COALESCE(?, title),
        details = COALESCE(?, details),
        domain_id = COALESCE(?, domain_id),
        owner_id = COALESCE(?, owner_id),
        due_date = COALESCE(?, due_date),
        due_time = COALESCE(?, due_time),
        frequency_type = COALESCE(?, frequency_type),
        frequency_interval = COALESCE(?, frequency_interval),
        is_completed = COALESCE(?, is_completed),
        completed_at = CASE WHEN ? IS NOT NULL THEN ${completedAt} ELSE completed_at END,
        updated_at = datetime('now')
      WHERE id = ?`,
      [
        title,
        details,
        domain_id,
        owner_id,
        due_date,
        due_time,
        frequency_type,
        frequency_interval,
        is_completed,
        is_completed,
        params.id,
      ],
    )

    // Get updated task
    const updatedTask = await queryOne(
      `
      SELECT t.*, u.name as owner_name, d.name as domain_name
      FROM tasks t
      JOIN users u ON t.owner_id = u.id
      JOIN domains d ON t.domain_id = d.id
      WHERE t.id = ?
    `,
      [params.id],
    )

    return NextResponse.json({ success: true, task: updatedTask })
  } catch (error) {
    console.error(`Failed to update task ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Failed to update task", error: String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if task exists
    const existingTask = await queryOne("SELECT * FROM tasks WHERE id = ?", [params.id])
    if (!existingTask) {
      return NextResponse.json({ success: false, message: "Task not found" }, { status: 404 })
    }

    // Delete task (will cascade to subtasks due to foreign key constraints)
    await execute("DELETE FROM tasks WHERE id = ?", [params.id])

    return NextResponse.json({ success: true, message: "Task deleted successfully" })
  } catch (error) {
    console.error(`Failed to delete task ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Failed to delete task", error: String(error) },
      { status: 500 },
    )
  }
}
