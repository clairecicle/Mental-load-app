import { NextResponse } from "next/server"
import { query, execute, queryOne } from "@/lib/db"
import { generateUUID } from "@/lib/db-init"

export async function GET() {
  try {
    const items = await query(`
      SELECT s.*, 
             c.name as created_by_name,
             p.name as purchased_by_name
      FROM shopping_list_items s
      JOIN users c ON s.created_by_id = c.id
      LEFT JOIN users p ON s.purchased_by_id = p.id
      ORDER BY s.is_purchased ASC, s.created_at DESC
    `)

    return NextResponse.json({ success: true, items })
  } catch (error) {
    console.error("Failed to fetch shopping items:", error)
    return NextResponse.json(
      { success: false, message: "Failed to fetch shopping items", error: String(error) },
      { status: 500 },
    )
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { item_name, quantity, notes, household_id, created_by_id } = body

    if (!item_name || !household_id || !created_by_id) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 })
    }

    const id = generateUUID()

    await execute(
      `INSERT INTO shopping_list_items (
        id, item_name, quantity, notes, household_id, created_by_id
      ) VALUES (?, ?, ?, ?, ?, ?)`,
      [id, item_name, quantity, notes, household_id, created_by_id],
    )

    const newItem = await queryOne(
      `
      SELECT s.*, 
             c.name as created_by_name,
             p.name as purchased_by_name
      FROM shopping_list_items s
      JOIN users c ON s.created_by_id = c.id
      LEFT JOIN users p ON s.purchased_by_id = p.id
      WHERE s.id = ?
    `,
      [id],
    )

    return NextResponse.json({ success: true, item: newItem })
  } catch (error) {
    console.error("Failed to create shopping item:", error)
    return NextResponse.json(
      { success: false, message: "Failed to create shopping item", error: String(error) },
      { status: 500 },
    )
  }
}
