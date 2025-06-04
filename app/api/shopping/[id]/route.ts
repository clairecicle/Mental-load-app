import { NextResponse } from "next/server"
import { readDatabase, writeDatabase } from "@/lib/db"

export async function PUT(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { is_purchased, purchased_by_id, category } = body

    const db = await readDatabase()

    // Find the item
    const itemIndex = db.shopping_list_items.findIndex((item) => item.id === params.id)
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, message: "Shopping item not found" }, { status: 404 })
    }

    const item = db.shopping_list_items[itemIndex]

    // Update the item
    if (is_purchased !== undefined) {
      item.is_purchased = is_purchased
      item.purchased_by_id = is_purchased ? purchased_by_id : null
      item.purchased_at = is_purchased ? new Date().toISOString() : null
    }

    if (category !== undefined) {
      item.category = category
    }

    item.updated_at = new Date().toISOString()

    // Save to database
    await writeDatabase(db)

    // Get user names for response
    const createdBy = db.users.find((u) => u.id === item.created_by_id)
    const purchasedBy = item.purchased_by_id ? db.users.find((u) => u.id === item.purchased_by_id) : null

    const responseItem = {
      ...item,
      created_by_name: createdBy?.name || "Unknown",
      purchased_by_name: purchasedBy?.name || null,
    }

    return NextResponse.json({ success: true, item: responseItem })
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
    const db = await readDatabase()

    // Find the item
    const itemIndex = db.shopping_list_items.findIndex((item) => item.id === params.id)
    if (itemIndex === -1) {
      return NextResponse.json({ success: false, message: "Shopping item not found" }, { status: 404 })
    }

    // Remove the item
    db.shopping_list_items.splice(itemIndex, 1)

    // Save to database
    await writeDatabase(db)

    return NextResponse.json({ success: true, message: "Shopping item deleted successfully" })
  } catch (error) {
    console.error(`Failed to delete shopping item ${params.id}:`, error)
    return NextResponse.json(
      { success: false, message: "Failed to delete shopping item", error: String(error) },
      { status: 500 },
    )
  }
}
