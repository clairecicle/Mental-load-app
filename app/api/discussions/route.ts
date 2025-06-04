import { NextResponse } from "next/server"
import { query, execute, queryOne } from "@/lib/db"
import { generateUUID } from "@/lib/db-init"

export async function GET() {
  try {
    const discussions = await query(`
      SELECT d.*, u.name as created_by_name
      FROM discussion_items d
      JOIN users u ON d.created_by_id = u.id
      ORDER BY d.created_at DESC
    `)

    return NextResponse.json({ success: true, discussions })
  } catch (error) {
    console.error("Failed to fetch discussions:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch discussions", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { title, details, household_id, created_by_id, links, screenshots } = body

    if (!title || !household_id || !created_by_id) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const id = generateUUID()
    const linksJson = links ? JSON.stringify(links) : null
    const screenshotsJson = screenshots ? JSON.stringify(screenshots) : null

    await execute(
      `INSERT INTO discussion_items (
        id, title, details, household_id, created_by_id, links, screenshots
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, title, details, household_id, created_by_id, linksJson, screenshotsJson],
    )

    const newDiscussion = await queryOne(
      `
      SELECT d.*, u.name as created_by_name
      FROM discussion_items d
      JOIN users u ON d.created_by_id = u.id
      WHERE d.id = ?
    `,
      [id],
    )

    return NextResponse.json({ success: true, discussion: newDiscussion })
  } catch (error) {
    console.error("Failed to create discussion:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create discussion", error: String(error) },
      { status: 500 },
    )
  }
}
