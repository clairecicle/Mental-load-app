import { NextResponse } from "next/server"
import { execute, queryOne } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { is_purchased, purchased_by_id } = body

    // Check if item exists
    const existingItem = await queryOne("SELECT * FROM shopping_list_items WHERE id = ?", [params.id])
    if (!existingItem) {
      return NextResponse.json({ success: false, message: "Shopping item not found" }, { status: 404 })
    }

    // Update item
    const purchasedAt = is_purchased ? "datetime('now')" : null

    await execute(
      `UPDATE shopping_list_items SET
        is_purchased = COALESCE(?, is_purchased),
        purchased_by_id = CASE WHEN ? = 1 THEN ? ELSE NULL END,
        purchased_at = CASE WHEN ? = 1 THEN ${purchasedAt} ELSE NULL END
      WHERE id = ?`,
      [is_purchased, is_purchased, purchased_by_id, is_purchased, params.id],
    )

    // Get updated item
    const updatedItem = await queryOne(
      `
      SELECT s.*, 
             c.name as created_by_name,
             p.name as purchased_by_name
      FROM shopping_list_items s
      JOIN users c ON s.created_by_id = c.id
      LEFT JOIN users p ON s.purchased_by_id = p.id
      WHERE s.id = ?
    `,
      [params.id],
    )

    return NextResponse.json({ success: true, item: updatedItem })
  } catch (error) {
    console.error(`Failed to update shopping item ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Failed to update shopping item", error: String(error) },
      { status: 500 },
    )
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    // Check if item exists
    const existingItem = await queryOne("SELECT * FROM shopping_list_items WHERE id = ?", [params.id])
    if (!existingItem) {
      return NextResponse.json({ success: false, message: "Shopping item not found" }, { status: 404 })
    }

    // Delete item
    await execute("DELETE FROM shopping_list_items WHERE id = ?", [params.id])

    return NextResponse.json({ success: true, message: "Shopping item deleted successfully" })
  } catch (error) {
    console.error(`Failed to delete shopping item ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Failed to delete shopping item", error: String(error) },
      { status: 500 },
    )
  }
}
