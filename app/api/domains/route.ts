import { NextResponse } from "next/server"
import { query, execute, queryOne } from "@/lib/db"
import { generateUUID } from "@/lib/db-init"

export async function GET() {
  try {
    const domains = await query(`
      SELECT d.*, u.name as owner_name
      FROM domains d
      JOIN users u ON d.owner_id = u.id
    `)

    return NextResponse.json({ success: true, domains })
  } catch (error) {
    console.error("Failed to fetch domains:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch domains", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { name, details, household_id, owner_id, links, screenshots } = body

    if (!name || !household_id || !owner_id) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const id = generateUUID()
    const linksJson = links ? JSON.stringify(links) : null
    const screenshotsJson = screenshots ? JSON.stringify(screenshots) : null

    await execute(
      `INSERT INTO domains (
        id, name, details, household_id, owner_id, links, screenshots
      ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [id, name, details, household_id, owner_id, linksJson, screenshotsJson],
    )

    const newDomain = await queryOne(
      `
      SELECT d.*, u.name as owner_name
      FROM domains d
      JOIN users u ON d.owner_id = u.id
      WHERE d.id = ?
    `,
      [id],
    )

    return NextResponse.json({ success: true, domain: newDomain })
  } catch (error) {
    console.error("Failed to create domain:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create domain", error: String(error) },
      { status: 500 },
    )
  }
}
